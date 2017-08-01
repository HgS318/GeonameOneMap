package com.rs.geonameonemap.db.mysql.queries;

import com.rs.geonameonemap.db.DbUse;
import com.rs.geonameonemap.db.mysql.connections.*;
import com.rs.geonameonemap.json.PlaceJson;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

public class PlaceQuery extends MySQLQuery {

    public static final String tbName = "pn";
    public static final String tmpTbName = "pn_temp";
//    public static String[] columns = null;
    public static String[] columns = new String[]{
            "id", "name", "大类", "小类", "position", "X", "Y", "spaType", "spaTypeName",
            "path", "标准名称", "图名图号年版", "比例尺", "使用时间", "普查状态",
            "设立年份", "废止年份", "东经", "北纬", "至北纬", "坐标系", "测量方法", "地名来历",
            "地名含义", "历史沿革", "地理实体描述", "资料来源及出处", "所在跨行政区",
            "dist", "citycode", "ChnSpell", "brif", "TSCG", "DXCG", "SJCG", "SJQJ", "SJHR",
            "SJDJ", "SJDS", "YGCG", "YGDS", "SWCG", "LTCG", "SYCG", "SPCG"
    };
    public static String[] easyColumnNames = new String[]{
            "id", "name", "nickname", "大类", "小类", "position", "spaType", "path",
            "所在跨行政区", "dist", "citycode", "ChnSpell", "brif"
    };

    public static String getTotalGeonameInfo(){
        String sql = "SELECT * from " + tbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getTotalTempGeonameInfo(){
        String sql = "SELECT * from " + tmpTbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getEasyGeonameInfo(){
        String sql = "SELECT * from " + tbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps, easyColumnNames);
        return str;
    }

    public static String getEasyTempGeonameInfo(){
        String sql = "SELECT * from " + tmpTbName;
        List<PlaceJson> ps = searchPlaces(sql);
        if(ps.size() < 1) {
            return null;
        }
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getRandomResults(boolean admin) {
        String sql = null;
        if(admin) {
            sql = "SELECT * from " + tmpTbName;
        } else {
            sql = "SELECT * from " + tbName;
        }
        List<PlaceJson> ps = searchPlaces(sql);
        int len = ps.size();
        if(len < 1) {
            return "{}";
        }
        int[] randomIds = DbUse.createRandomIds(len);
        if(randomIds.length < 1) {
            return "{}";
        }
        List<PlaceJson> re = new LinkedList<PlaceJson>();
        for(int i = 0; i < randomIds.length; i++) {
            re.add(ps.get(i));
        }
        String str = PlaceJson.toJson(re);
        return str;
    }

    public static String getGeonameInfoByNickname(String val, boolean admin){
        String sql = null;
        if(admin) {
            PlaceJson.consColumnNames(dbType, tmpTbName);
            sql = "SELECT * from " + tmpTbName + " where nickname = '" + val +
                    "' or ChnSpell = '" + val + "' or name = '" + val + "'";
        } else {
            PlaceJson.consColumnNames(dbType, tbName);
            sql = "SELECT * from " + tbName + " where nickname = '" + val +
                    "' or ChnSpell = '" + val + "' or name = '" + val + "'";
        }
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        PlaceJson dj = null;
        try {
            if (rs.next()) {
                dj = new PlaceJson(rs);
            } else {
                return null;
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        String str = dj.toFullJson();
        return str;
    }

    public static String getGeonameInfoByAttr(String attr, String val, boolean admin){
        String sql = admin ? "SELECT * from " + tmpTbName + " where " + attr + " = '" + val + "'":
            "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getGeonameInfoByNum(String attr, String numVal, boolean admin){
        String sql = admin ? "SELECT * from " + tmpTbName + " where " + attr + " = " + numVal :
        "SELECT * from " + tbName + " where " + attr + " = " + numVal;
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toJson(ps);
        return str;
    }

    public static String getGeonameFullByAttr(String attr, String val, boolean admin){
        String sql =admin ? "SELECT * from " + tmpTbName + " where " + attr + " = '" + val + "'" :
                "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        String str = PlaceJson.toFullJson(ps);
        return str;
    }

    public static List<PlaceJson> searchByAttribute(String attr, String val) {
        String sql = "SELECT * from " + tbName + " where " + attr + " = '" + val + "'";
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    public static List<PlaceJson> searchByNumber(String attr, Object numObj) {
        String sql = "SELECT * from " + tbName + " where " + attr + " = " + numObj;
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    public static List<PlaceJson> searchFuzzy(String val) {
        String sql = "SELECT * from " + tbName + " where name like '%" + val + "' ";
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<PlaceJson> ps = searchPlaces(sql);
        return ps;
    }

    public static List<PlaceJson> searchPlaces(String sql) {
        PlaceJson.consColumnNames(dbType, tbName);
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        List<PlaceJson> ps = new LinkedList<PlaceJson>();
        try {
            while (rs.next()) {
                PlaceJson dj = new PlaceJson(rs);
                ps.add(dj);
            }
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        return ps;
    }





}
