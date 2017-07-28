package com.rs.geonameonemap.db.mysql.queries;

import com.rs.geonameonemap.db.DbUse;
import com.rs.geonameonemap.db.mysql.connections.MysqlLocalConnection;
import com.rs.geonameonemap.json.BoundMarkerJson;
import com.rs.geonameonemap.json.ObjectJson;

import java.sql.*;

/**
 * Created by Administrator on 2017/7/28 0028.
 */
public class BoundMarkerQuery extends MySQLQuery {

    public static final String tbName = "enshiboundrymarker";

    public static String getEasyBoundMarkersInfo() {
        BoundMarkerJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundsInfoFromResultSet(rs);
        return str;
    }

    public static String getBoundMarkerInfoByNum(String attr, String val) {
        BoundMarkerJson bj = searchBoundInfoByNum(attr, val);
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
        BoundMarkerJson[] bs = new BoundMarkerJson[num];
        try {
            int i = 0;
            do {
                BoundMarkerJson dj = new BoundMarkerJson(rs);
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


    public static BoundMarkerJson searchBoundInfoByNum(String attr, String val) {
        BoundMarkerJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName +" where " + attr +" = " + val;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        BoundMarkerJson bj = null;
        try {
            if (rs.next()) {
                bj = new BoundMarkerJson(rs);
            }
        } catch (SQLException se) {
            se.printStackTrace();
        } finally {
            return bj;
        }
    }


}
