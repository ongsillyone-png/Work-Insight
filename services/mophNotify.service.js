const { pool } = require('../config/database');

class MophNotifyService {
  async sendDailySummary(settings) {
    if (!settings.moph_client_key || !settings.moph_secret_key) {
      console.log('MOPH Notify: Missing Client Key or Secret Key. Skipping.');
      return;
    }

    try {
      // 1. Get today's date in YYYY-MM-DD
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      const dateDisplay = `${dd}/${mm}/${yyyy}`; // Thai format is typical, but this works

      // 2. Fetch all active users
      const usersRow = await pool.query('SELECT id, full_name FROM users WHERE is_active = 1 AND deleted_at IS NULL');
      
      // 3. Fetch today's logs
      const logsRow = await pool.query(
        'SELECT user_id, duration FROM activity_logs WHERE log_date = ? AND deleted_at IS NULL',
        [dateString]
      );

      // 4. Aggregate data
      const userStats = {};
      usersRow.forEach(u => {
        userStats[u.id] = { name: u.full_name, count: 0, totalMinutes: 0 };
      });

      logsRow.forEach(log => {
        if (userStats[log.user_id]) {
          userStats[log.user_id].count++;
          userStats[log.user_id].totalMinutes += parseInt(log.duration || 0, 10);
        }
      });

      // 5. Build summary lists
      const loggedUsers = [];
      const unloggedUsers = [];

      usersRow.forEach(u => {
        const stat = userStats[u.id];
        if (stat.count > 0) {
          const hours = (stat.totalMinutes / 60).toFixed(1);
          loggedUsers.push(`- ${stat.name}: ${stat.count} กิจกรรม (${hours} ชม.)`);
        } else {
          unloggedUsers.push(`- ${stat.name}`);
        }
      });

      // 6. Construct message
      let message = `📋 สรุปผลการบันทึกกิจกรรมประจำวัน\n🗓️ วันที่: ${dateDisplay}\n\n`;
      
      message += `✅ [บันทึกแล้ว ${loggedUsers.length} คน]\n`;
      if (loggedUsers.length > 0) {
        message += loggedUsers.join('\n') + '\n\n';
      } else {
        message += '- ไม่มี\n\n';
      }

      message += `❌ [ยังไม่บันทึก ${unloggedUsers.length} คน]\n`;
      if (unloggedUsers.length > 0) {
        message += unloggedUsers.join('\n');
      } else {
        message += '- ไม่มี';
      }

      console.log('MOPH Notify: Sending payload...');
      
      // 7. Send to MOPH API
      const payload = {
        messages: [
          {
            type: "text",
            text: message
          }
        ]
      };

      const response = await fetch('https://morpromt2f.moph.go.th/api/notify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-key': settings.moph_client_key,
          'secret-key': settings.moph_secret_key
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      
      if (response.ok) {
        console.log('MOPH Notify: Successfully sent daily summary.');
      } else {
        console.error(`MOPH Notify: Failed to send. Status: ${response.status} Response: ${responseText}`);
      }

    } catch (err) {
      console.error('MOPH Notify: Error generating or sending summary:', err);
    }
  }
}

module.exports = new MophNotifyService();
