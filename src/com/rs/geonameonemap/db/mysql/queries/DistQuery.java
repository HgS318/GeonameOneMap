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
    public static String[] easyColumnNames = new String[]{
            "id", "name", "nickname", "大类", "小类", "position", "spaType", "path",
            "所在跨行政区", "dist", "citycode", "ChnSpell", "brif"
    };


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

    public static String getDistInfoByAttr(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id where " + attr + " = '" + val +"'";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static List<DistJson> serachDistsByAttr(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id where " + attr + " = '" + val +"'";
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        return ds;
    }

    public static String getDistInfoByNum(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".Id where "
                + tbName + "." + attr + " = " + val;
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        String str = getDistsInfoFromResultSet(rs);
        return str;
    }

    public static List<DistJson> serachDistsByNum(String attr, String val) {
        String sql = "SELECT * from " + tbName + " LEFT JOIN " + PlaceQuery.tbName + " ON " +
                tbName +".PNid = " + PlaceQuery.tbName + ".id where " + attr + " = " + val;
        ResultSet rs = DistJson.consColumnNamesBySql(dbType, sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        return ds;
    }

    protected  static List<DistJson> getDistsFromResultSet(ResultSet rs) {
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
        return ds;
    }

    protected static String getDistsInfoFromResultSet(ResultSet rs) {
        List<DistJson> ds = getDistsFromResultSet(rs);
        if(ds == null) {
            return null;
        }
        for(DistJson pj : ds) {
            DistJson par = DistJson.findObj(ds, pj.parcode);
            if(par != null) {
                pj.setParent(par);
            }
        }
        return ds.get(0).toFullJson();
    }

    public static List<DistJson> searchDists(String sql) {
        DistJson.consColumnNames(dbType, tbName);
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<DistJson> ds = getDistsFromResultSet(rs);
        return ds;
    }

    public static void main(String[] args) {
        getTotalDistInfo();
    }


}
