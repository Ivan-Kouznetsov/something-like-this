const mariadb = require("mariadb");

const mariadbReporter = async (
  testResult,
  testName,
  user,
  password,
  host = "localhost",
  port = 3306,
  database = "tests"
) => {
  const pool = mariadb.createPool({
    host,
    port,
    user,
    password,
    connectionLimit: 5,
    database,
  });
  let connection;
  try {
    connection = await pool.getConnection();
    const res = await connection.query(
      "INSERT INTO testResults (DateTime, TestName, Passed, FailedRules, Duration) value (NOW(), ?, ?, ?, ?)",
      [
        testName,
        testResult.isMatch,
        JSON.stringify(testResult.failedRules),
        testResult.duration,
      ]
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) return connection.end();
  }
};

module.exports = { mariadbReporter };
