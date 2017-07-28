package com.rs.geonameonemap.db.mysql.queries;

import com.rs.geonameonemap.db.DbUse;
import com.rs.geonameonemap.db.mysql.connections.*;
import com.rs.geonameonemap.json.BoundJson;
import com.rs.geonameonemap.json.ObjectJson;

import java.sql.*;
import java.util.*;

/**
 * Created by Administrator on 2017/7/28 0028.
 */
public class BoundQuery extends MySQLQuery {

    public static final String tbName = "enshidivid";


    public static String getEasyBoundsInfo() {
        BoundJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundsInfoFromResultSet(rs);
        return str;
    }

    public static String getBoundInfoByNum(String attr, String val) {
        BoundJson bj = searchBoundInfoByNum(attr, val);
        if(bj != null) {
            return bj.toJson();
        } else {
            return null;
        }
    }

    protected static String getBoundsInfoFromResultSet(ResultSet rs) {
        int num = DbUse.getResultSetRowNum(rs);
        if(num < 1) {
            return null;
        }
        BoundJson[] bs = new BoundJson[num];
        try {
            int i = 0;
            do {
                BoundJson dj = new BoundJson(rs);
                bs[i] = dj;
                i++;
            } while (rs.next());
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        String str = ObjectJson.toJson(bs);
        return str;
    }


    public static BoundJson searchBoundInfoByNum(String attr, String val) {
        BoundJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName +" where " + attr +" = " + val;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        BoundJson bj = null;
        try {
            if (rs.next()) {
                bj = new BoundJson(rs);
            }
        } catch (SQLException se) {
            se.printStackTrace();
        } finally {
            return bj;
        }
    }

}
