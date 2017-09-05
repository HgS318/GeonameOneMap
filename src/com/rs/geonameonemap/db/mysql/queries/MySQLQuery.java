package com.rs.geonameonemap.db.mysql.queries;

import java.sql.Connection;

/**
 * Created by Administrator on 2017/7/27 0027.
 */
public class MySQLQuery {

//    public static Connection conn = null;
    public static String dbType = "mysql";


    public static String createSqlColumns(String[] columnNames) {
        StringBuffer sb = new StringBuffer();
        for(String str : columnNames) {
            sb.append(" `" ).append(str).append("`,");
        }
        sb.deleteCharAt(sb.length() - 1);
        sb.append(' ');
        String sqlColumns = sb.toString();
        return sqlColumns;
    }


}
