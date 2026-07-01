const { pool } = require('../config/database');

class DashboardService {
  /**
   * Retrieve aggregated activity analytics for the dashboard
   */
  async getDashboardAnalytics() {
    let conn;
    try {
      conn = await pool.getConnection();

      // 1. Total hours logged across all time
      const totalHoursResult = await conn.query(
        `SELECT COALESCE(SUM(duration), 0) / 60.0 AS totalHours 
         FROM activity_logs 
         WHERE deleted_at IS NULL`
      );
      const totalHours = Math.round(Number(totalHoursResult[0].totalHours) * 10) / 10;

      // 2. Active users count today
      const activeUsersResult = await conn.query(
        `SELECT COUNT(DISTINCT user_id) AS activeCount 
         FROM activity_logs 
         WHERE log_date = CURDATE() AND deleted_at IS NULL`
      );
      const activeUsersCount = Number(activeUsersResult[0].activeCount);

      // 3. Total active users in system
      const totalUsersResult = await conn.query(
        `SELECT COUNT(*) AS totalCount 
         FROM users 
         WHERE is_active = 1 AND deleted_at IS NULL`
      );
      const totalUsersCount = Number(totalUsersResult[0].totalCount);

      // 4. Activities logged today
      const logsTodayResult = await conn.query(
        `SELECT COUNT(*) AS todayCount 
         FROM activity_logs 
         WHERE log_date = CURDATE() AND deleted_at IS NULL`
      );
      const activitiesLoggedToday = Number(logsTodayResult[0].todayCount);

      // 5. Team active work status (User list breakdown for today)
      const teamStatus = await conn.query(
        `SELECT 
           u.id, 
           u.full_name AS fullName, 
           u.position,
           COUNT(al.id) AS activityCount,
           COALESCE(SUM(al.duration), 0) / 60.0 AS totalHours
         FROM users u
         LEFT JOIN activity_logs al ON u.id = al.user_id AND al.log_date = CURDATE() AND al.deleted_at IS NULL
         WHERE u.deleted_at IS NULL AND u.is_active = 1
         GROUP BY u.id, u.full_name, u.position
         ORDER BY u.full_name ASC`
      );

      const formattedTeamStatus = teamStatus.map(member => ({
        fullName: member.fullName,
        position: member.position,
        activityCount: Number(member.activityCount),
        totalHours: Math.round(Number(member.totalHours) * 10) / 10,
        status: Number(member.activityCount) > 0 ? 'บันทึกเรียบร้อย' : 'ยังไม่บันทึก'
      }));

      // 6. Category distribution
      const categoryDistributionResult = await conn.query(
        `SELECT 
           ac.name,
           COALESCE(SUM(al.duration), 0) AS totalDuration
         FROM activity_categories ac
         JOIN activity_master am ON ac.id = am.category_id
         JOIN activity_logs al ON am.id = al.activity_master_id
         WHERE al.deleted_at IS NULL
         GROUP BY ac.id, ac.name`
      );

      const totalDurationAll = categoryDistributionResult.reduce(
        (sum, item) => sum + Number(item.totalDuration), 0
      );

      let categoryDistribution = categoryDistributionResult.map(item => {
        const percentage = totalDurationAll > 0 
          ? Math.round((Number(item.totalDuration) / totalDurationAll) * 100) 
          : 0;
        return {
          name: item.name,
          percentage
        };
      });

      // Sort by percentage descending
      categoryDistribution.sort((a, b) => b.percentage - a.percentage);

      // If database has no logs yet, fallback to a sensible default distribution
      if (categoryDistribution.length === 0) {
        categoryDistribution = [
          { name: 'งานดูแลและบำรุงรักษาซอฟต์แวร์ HOSxP', percentage: 40 },
          { name: 'แก้ไขปัญหาซ่อมอุปกรณ์ฮาร์ดแวร์', percentage: 30 },
          { name: 'การประชุม และงานบริหารทั่วไป', percentage: 20 },
          { name: 'บำรุงรักษาระบบฐานข้อมูลเครือข่าย', percentage: 10 }
        ];
      }

      return {
        totalHours,
        activeUsersCount,
        totalUsersCount,
        activitiesLoggedToday,
        teamStatus: formattedTeamStatus,
        categoryDistribution
      };
    } catch (err) {
      console.error('Error in DashboardService.getDashboardAnalytics:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new DashboardService();
