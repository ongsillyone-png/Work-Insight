const { pool } = require('../config/database');

class DashboardService {
  /**
   * Retrieve aggregated activity analytics for the dashboard
   */
  async getDashboardAnalytics(filters = {}) {
    const { startDate, endDate } = filters;
    let conn;
    try {
      conn = await pool.getConnection();

      // 1. Total hours logged in period
      const totalHoursResult = await conn.query(
        `SELECT COALESCE(SUM(duration), 0) / 60.0 AS totalHours 
         FROM activity_logs 
         WHERE log_date BETWEEN ? AND ? AND deleted_at IS NULL`,
         [startDate, endDate]
      );
      const totalHours = Math.round(Number(totalHoursResult[0].totalHours) * 10) / 10;

      // 2. Active users count in period
      const activeUsersResult = await conn.query(
        `SELECT COUNT(DISTINCT user_id) AS activeCount 
         FROM activity_logs 
         WHERE log_date BETWEEN ? AND ? AND deleted_at IS NULL`,
         [startDate, endDate]
      );
      const activeUsersCount = Number(activeUsersResult[0].activeCount);

      // 3. Total active users in system
      const totalUsersResult = await conn.query(
        `SELECT COUNT(*) AS totalCount 
         FROM users 
         WHERE is_active = 1 AND deleted_at IS NULL`
      );
      const totalUsersCount = Number(totalUsersResult[0].totalCount);

      // 4. Activities logged in period
      const logsTodayResult = await conn.query(
        `SELECT COUNT(*) AS todayCount 
         FROM activity_logs 
         WHERE log_date BETWEEN ? AND ? AND deleted_at IS NULL`,
         [startDate, endDate]
      );
      const activitiesLoggedToday = Number(logsTodayResult[0].todayCount);

      // 5. Team active work status (User list breakdown in period)
      const teamStatus = await conn.query(
        `SELECT 
           u.id, 
           u.full_name AS fullName, 
           u.position,
           COUNT(al.id) AS activityCount,
           COALESCE(SUM(al.duration), 0) / 60.0 AS totalHours
         FROM users u
         LEFT JOIN activity_logs al ON u.id = al.user_id AND al.log_date BETWEEN ? AND ? AND al.deleted_at IS NULL
         WHERE u.deleted_at IS NULL AND u.is_active = 1
         GROUP BY u.id, u.full_name, u.position
         ORDER BY u.full_name ASC`,
         [startDate, endDate]
      );

      const formattedTeamStatus = teamStatus.map(member => ({
        fullName: member.fullName,
        position: member.position,
        activityCount: Number(member.activityCount),
        totalHours: Math.round(Number(member.totalHours) * 10) / 10,
        status: Number(member.activityCount) > 0 ? 'บันทึกเรียบร้อย' : 'ยังไม่บันทึก'
      }));

      // 6. Category, Group and Activity 3-level distribution queried dynamically from database master tables
      const fullDistributionResult = await conn.query(
        `SELECT 
           ac.name AS categoryName,
           ag.name AS groupName,
           am.name AS activityName,
           COALESCE(SUM(al.duration), 0) AS totalDuration
         FROM activity_categories ac
         JOIN activity_master am ON ac.id = am.category_id AND am.deleted_at IS NULL
         JOIN activity_groups ag ON am.group_id = ag.id AND ag.deleted_at IS NULL
         LEFT JOIN activity_logs al ON am.id = al.activity_master_id AND al.log_date BETWEEN ? AND ? AND al.deleted_at IS NULL
         WHERE ac.deleted_at IS NULL
         GROUP BY ac.id, ac.name, ag.id, ag.name, am.id, am.name`,
         [startDate, endDate]
      );

      // Build the nested tree map from master configuration
      const categoryMap = {};
      fullDistributionResult.forEach(row => {
        const catName = row.categoryName;
        const grpName = row.groupName;
        const actName = row.activityName;
        const duration = Number(row.totalDuration);

        if (!categoryMap[catName]) {
          categoryMap[catName] = {
            name: catName,
            duration: 0,
            groups: {}
          };
        }
        categoryMap[catName].duration += duration;

        if (!categoryMap[catName].groups[grpName]) {
          categoryMap[catName].groups[grpName] = {
            name: grpName,
            duration: 0,
            activities: {}
          };
        }
        categoryMap[catName].groups[grpName].duration += duration;

        if (!categoryMap[catName].groups[grpName].activities[actName]) {
          categoryMap[catName].groups[grpName].activities[actName] = {
            name: actName,
            duration: 0
          };
        }
        categoryMap[catName].groups[grpName].activities[actName].duration += duration;
      });

      const totalDurationAll = Object.values(categoryMap).reduce((sum, cat) => sum + cat.duration, 0);

      let categoryDistribution = Object.values(categoryMap).map(cat => {
        const catPercentage = totalDurationAll > 0 
          ? Math.round((cat.duration / totalDurationAll) * 100) 
          : 0;

        const groups = Object.values(cat.groups).map(grp => {
          const grpPercentage = cat.duration > 0
            ? Math.round((grp.duration / cat.duration) * 100)
            : 0;

          const activities = Object.values(grp.activities).map(act => {
            const actPercentage = grp.duration > 0
              ? Math.round((act.duration / grp.duration) * 100)
              : 0;

            return {
              name: act.name,
              percentage: actPercentage
            };
          });

          // Sort activities by percentage descending, or alphabetically by Thai name
          activities.sort((a, b) => {
            if (b.percentage !== a.percentage) {
              return b.percentage - a.percentage;
            }
            return a.name.localeCompare(b.name, 'th');
          });

          return {
            name: grp.name,
            percentage: grpPercentage,
            activities
          };
        });

        // Sort groups by percentage descending, or alphabetically by Thai name
        groups.sort((a, b) => {
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
          }
          return a.name.localeCompare(b.name, 'th');
        });

        return {
          name: cat.name,
          percentage: catPercentage,
          groups
        };
      });

      // Sort categories by percentage descending, or alphabetically by Thai name
      categoryDistribution.sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return a.name.localeCompare(b.name, 'th');
      });

      // 7. Daily trend (hours per day)
      let trendStart = startDate;
      let trendEnd = endDate;
      if (startDate === endDate) {
        // If range is a single day (e.g. today), show 7 days trend
        const { getLocalDateString } = require('../utils/date');
        const d = new Date(startDate);
        d.setDate(d.getDate() - 6);
        trendStart = getLocalDateString(d);
      }

      const dailyTrendResult = await conn.query(
        `SELECT 
           log_date AS logDate,
           COALESCE(SUM(duration), 0) / 60.0 AS totalHours
         FROM activity_logs
         WHERE log_date BETWEEN ? AND ? AND deleted_at IS NULL
         GROUP BY log_date
         ORDER BY log_date ASC`,
         [trendStart, trendEnd]
      );

      const trendMap = {};
      dailyTrendResult.forEach(row => {
        // Format date safely as YYYY-MM-DD
        const d = new Date(row.logDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        trendMap[dateStr] = Math.round(Number(row.totalHours) * 10) / 10;
      });

      const dailyTrend = [];
      let current = new Date(trendStart);
      const end = new Date(trendEnd);
      while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const dateLabel = current.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
        dailyTrend.push({
          date: dateStr,
          label: dateLabel,
          hours: trendMap[dateStr] || 0
        });
        current.setDate(current.getDate() + 1);
      }

      return {
        totalHours,
        activeUsersCount,
        totalUsersCount,
        activitiesLoggedToday,
        teamStatus: formattedTeamStatus,
        categoryDistribution,
        dailyTrend
      };
    } catch (err) {
      console.error('Error in DashboardService.getDashboardAnalytics:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async getDetailedLogs(startDate, endDate) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        `SELECT 
           al.log_date AS logDate,
           u.full_name AS fullName,
           u.position AS position,
           am.name AS activityName,
           al.output AS activityOutput,
           al.remark AS activityRemark,
           al.duration AS duration,
           COALESCE(l.name, '-') AS locationName,
           COALESCE(ac.name, '-') AS categoryName,
           COALESCE(ag.name, '-') AS groupName,
           al.session AS session
         FROM activity_logs al
         JOIN users u ON al.user_id = u.id
         LEFT JOIN locations l ON al.location_id = l.id
         LEFT JOIN activity_master am ON al.activity_master_id = am.id
         LEFT JOIN activity_categories ac ON am.category_id = ac.id
         LEFT JOIN activity_groups ag ON am.group_id = ag.id
         WHERE al.log_date BETWEEN ? AND ? AND al.deleted_at IS NULL
         ORDER BY al.log_date DESC, u.full_name ASC`,
        [startDate, endDate]
      );
      return rows;
    } catch (err) {
      console.error('Error in DashboardService.getDetailedLogs:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async getPersonalDistribution(userId, startDate, endDate) {
    let conn;
    try {
      conn = await pool.getConnection();
      const fullDistributionResult = await conn.query(
        `SELECT 
           ac.name AS categoryName,
           ag.name AS groupName,
           am.name AS activityName,
           COALESCE(SUM(al.duration), 0) AS totalDuration
         FROM activity_categories ac
         JOIN activity_master am ON ac.id = am.category_id AND am.deleted_at IS NULL
         JOIN activity_groups ag ON am.group_id = ag.id AND ag.deleted_at IS NULL
         LEFT JOIN activity_logs al ON am.id = al.activity_master_id AND al.user_id = ? AND al.log_date BETWEEN ? AND ? AND al.deleted_at IS NULL
         WHERE ac.deleted_at IS NULL
         GROUP BY ac.id, ac.name, ag.id, ag.name, am.id, am.name`,
         [userId, startDate, endDate]
      );

      // Build the nested tree map from master configuration
      const categoryMap = {};
      fullDistributionResult.forEach(row => {
        const catName = row.categoryName;
        const grpName = row.groupName;
        const actName = row.activityName;
        const duration = Number(row.totalDuration);

        if (!categoryMap[catName]) {
          categoryMap[catName] = {
            name: catName,
            duration: 0,
            groups: {}
          };
        }
        categoryMap[catName].duration += duration;

        if (!categoryMap[catName].groups[grpName]) {
          categoryMap[catName].groups[grpName] = {
            name: grpName,
            duration: 0,
            activities: {}
          };
        }
        categoryMap[catName].groups[grpName].duration += duration;

        if (!categoryMap[catName].groups[grpName].activities[actName]) {
          categoryMap[catName].groups[grpName].activities[actName] = {
            name: actName,
            duration: 0
          };
        }
        categoryMap[catName].groups[grpName].activities[actName].duration += duration;
      });

      const totalDurationAll = Object.values(categoryMap).reduce((sum, cat) => sum + cat.duration, 0);

      let categoryDistribution = Object.values(categoryMap).map(cat => {
        const catPercentage = totalDurationAll > 0 
          ? Math.round((cat.duration / totalDurationAll) * 100) 
          : 0;

        const groups = Object.values(cat.groups).map(grp => {
          const grpPercentage = cat.duration > 0
            ? Math.round((grp.duration / cat.duration) * 100)
            : 0;

          const activities = Object.values(grp.activities).map(act => {
            const actPercentage = grp.duration > 0
              ? Math.round((act.duration / grp.duration) * 100)
              : 0;

            return {
              name: act.name,
              percentage: actPercentage
            };
          });

          // Sort activities by percentage descending, or alphabetically by Thai name
          activities.sort((a, b) => {
            if (b.percentage !== a.percentage) {
              return b.percentage - a.percentage;
            }
            return a.name.localeCompare(b.name, 'th');
          });

          return {
            name: grp.name,
            percentage: grpPercentage,
            activities
          };
        });

        // Sort groups by percentage descending, or alphabetically by Thai name
        groups.sort((a, b) => {
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
          }
          return a.name.localeCompare(b.name, 'th');
        });

        return {
          name: cat.name,
          percentage: catPercentage,
          groups
        };
      });

      // Sort categories by percentage descending, or alphabetically by Thai name
      categoryDistribution.sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return a.name.localeCompare(b.name, 'th');
      });

      return categoryDistribution;
    } catch (err) {
      console.error('Error in DashboardService.getPersonalDistribution:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new DashboardService();
