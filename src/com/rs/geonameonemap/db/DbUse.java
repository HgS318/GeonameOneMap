package com.rs.geonameonemap.db;

import java.sql.*;

/**
 * Created by Administrator on 2017/7/23 0023.
 */
public class DbUse {

    public static void appendResult2JsonBuffer(ResultSet rs, StringBuffer jsonBuf, String[] columns) throws SQLException {
        jsonBuf.append("{");
        for(int j = 0; j < columns.length; j++) {
            String columnName = columns[j];
            Object obj = rs.getObject(columnName);
            if(obj == null) {
                continue;
            }
            String tmpValue = obj.toString();
            if(tmpValue == null || "".equals(tmpValue)) {
                continue;
            }
            tmpValue = tmpValue.replace('\"', '\'');
            String val = null;
            val = tmpValue.replace("\n", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
            jsonBuf.append("\"").append(columnName).append("\":\"").append(val).append("\",");
        }
        jsonBuf.append("}");
    }

    public static String result2String(ResultSet rs, String[] columns) throws SQLException {
        StringBuffer sb = new StringBuffer();
        appendResult2JsonBuffer(rs, sb, columns);
        String str = sb.toString();
        return str;
    }


    public static String getFileSuffix(String fileName) {
        int dId = fileName.lastIndexOf('.');
        if(dId < 0) {
            return null;
        }
        String suf = fileName.substring(dId);
        return suf;
    }

}
