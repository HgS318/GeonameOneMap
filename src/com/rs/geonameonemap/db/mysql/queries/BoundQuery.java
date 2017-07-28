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

//    public static String getBoundsInfoByAttr(String attr, String val) {
//
//    }

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


}
