package com.rs.geonameonemap.db.mysql.queries;

import com.rs.geonameonemap.db.mysql.connections.*;
import com.rs.geonameonemap.json.DistJson;
import com.rs.geonameonemap.json.PlaceJson;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;


public class DistQuery extends MySQLQuery {

    public static final String tbName = "ENSHIDISTS";
    public static String[] columns = null;


    public static String getEasyDistInfo() {
        DistJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName + " order by Id";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static String getTotalDistInfo() {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id order by " + tbName + ".id";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    protected static String getDistsInfoFromResultSet(ResultSet rs) {
        List<DistJson> ds = new LinkedList<DistJson>();
        try {
            while (rs.next()) {
                DistJson dj = new DistJson(rs);
                ds.add(dj);
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        if(ds.size() < 1) {
            return null;
        }
        for(DistJson pj : ds) {
            DistJson par = DistJson.findObj(ds, pj.parcode);
            if(par!=null) {
                pj.setParent(par);
            }
        }
        return ds.get(0).toFullJson();
    }

    public static void main(String[] args) {
        getTotalDistInfo();
    }


}
