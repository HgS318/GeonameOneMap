package com.rs.geonameonemap.db.mysql.connections;

import java.sql.*;
/**
 * Created by Administrator on 2017/7/27 0027.
 */
public class MysqlLocalConnection {
    public static final String dbDriver = "com.mysql.jdbc.Driver";
    public static final String dbAddr = "jdbc:mysql://localhost:3306/";
    public static String account = "root", password = "cartolab";
    protected String dbName = null;
    public static String defDbName = "geoname";
    protected static MysqlLocalConnection instance = null;
    protected Connection conn = null;

    public static MysqlLocalConnection getInstance() {
        if(instance == null) {
            instance = new MysqlLocalConnection();
        }
        return  instance;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String _dbName) {
        this.dbName = _dbName;
    }

    public static ResultSet executeQuery(String sql) {
        Statement st = null;
        ResultSet rs = null;
        Connection con = MysqlLocalConnection.getConnection();
        try {
            st = con.createStatement();
            rs = st.executeQuery(sql);
        } catch ( Exception de) {
            de.printStackTrace();
        }
        return rs;
    }

    private Connection newConn() throws SQLException{
        String connStr = dbAddr + dbName;
        conn = DriverManager.getConnection(connStr, account, password);
        System.out.println("数据库连接成功");
        return conn;
    }

    private Connection ensureConnection() {
        try {
            if(conn == null || conn.isClosed()) {
                newConn();
            }
        } catch (SQLException se) {
            se.printStackTrace();
            System.out.println("数据库连接失败");
        }
        return conn;
    }

    public Connection getConn() {
        if(dbName == null || "".equals(dbName)) {
            setDbName(MysqlLocalConnection.defDbName);
        }
        return ensureConnection();
    }

    public Connection getConn(String _dbName) {
        setDbName(_dbName);
        return ensureConnection();
    }


    public boolean init() {
        try {
            Class.forName(dbDriver);
            System.out.println("加载驱动成功");
            return true;
        } catch (ClassNotFoundException e1) {
            System.out.println("加载驱动失败");
            e1.printStackTrace();
            return false;
        }
    }

    protected MysqlLocalConnection() {
        init();
    }

    protected MysqlLocalConnection(String _dbName) {
        setDbName(_dbName);
        init();
    }


    public static Connection getConnection() {
        MysqlLocalConnection lc = MysqlLocalConnection.getInstance();
        Connection conn = lc.getConn();
        return conn;
    }


    public static void main(String[] args) {
        MysqlLocalConnection.getConnection();
    }


}
