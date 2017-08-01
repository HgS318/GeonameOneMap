package com.rs.geonameonemap.db;

import java.sql.*;
import java.util.*;

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

    public static int getResultSetRowNum(ResultSet resultSet) {
        int rowCount = -1;
        try {
            resultSet.last();
            rowCount = resultSet.getRow();
            resultSet.first();
        } catch (Exception e) {
            System.out.println("获取ResultSet行数失败...");
            e.printStackTrace();
        }
        return rowCount;
    }

    public static String columnsToSQL(String[] columns) {
        StringBuffer sb = new StringBuffer();
        for(int i = 0; i < columns.length; i++) {
            sb.append(" ").append(columns[i]);
            if(i != columns.length - 1) {
                sb.append(",");
            }
        }
        sb.append(" ");
        return sb.toString();
    }

    public static String getFileSuffix(String fileName) {
        int dId = fileName.lastIndexOf('.');
        if(dId < 0) {
            return null;
        }
        String suf = fileName.substring(dId);
        return suf;
    }


    public static void main(String[] args) {
        createRandomIds(4);
        createRandomIds(23);
        createRandomIds(58);
        createRandomIds(24);
    }

    public static int[] createRandomIds(int len) {
        Random random = new Random();
        List<Integer> lis = new LinkedList<Integer>();
        int total = random.nextInt(len);
        int resttotal = len - total;
        int offset = random.nextInt(resttotal);
        while(lis.size() < total) {
            int num = random.nextInt(total);
            boolean flag = false;
            for(Integer ext : lis) {
                if(ext == num) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                lis.add(num);
            }
        }
        int[] re = new int[total];
        for(int i = 0; i < total; i++) {
            re[i] = lis.get(i) + offset;
//            System.out.print(re[i] + ", ");
        }
//        System.out.println();
        return re;
    }

}
