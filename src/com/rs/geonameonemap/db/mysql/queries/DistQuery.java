package com.rs.geonameonemap.db.mysql.queries;

import com.rs.geonameonemap.db.mysql.connections.*;
import com.rs.geonameonemap.json.DistJson;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Administrator on 2017/7/23 0023.
 */
public class DistQuery extends MySQLQuery {

    public static final String tbName = "ENSHIDISTS";
    public static String[] columns = null;


    public static String getTotalDistInfo() {
        DistJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName + " order by Id";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
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
//        System.out.println(ds.get(0).toFullJson());
    }

    public static void main(String[] args) {
        getTotalDistInfo();
    }


}
