package com.rs.geonameonemap.controllers;

//import com.rs.geonameonemap.db.ms.queries.*;
import com.rs.geonameonemap.db.ms.queries.*;
import com.rs.geonameonemap.db.mysql.queries.*;
import java.io.*;
import java.util.*;

import javax.servlet.http.*;

import com.rs.geonameonemap.db.mysql.queries.DistQuery;
import com.rs.geonameonemap.db.mysql.queries.PlaceQuery;
import org.apache.poi.hslf.util.SystemTimeUtils;
import org.apache.struts2.ServletActionContext;

import net.sf.json.*;

public class JsonAction01 {


    public String randomResults() {
        String placeRandomResults = PlaceQuery.getRandomResults(false);
        String distRandomResults = DistQuery.getRandomResults(false);
        String boundRandomResults = BoundQuery.getRandomResults(false);
        String bmRandomResults = BoundMarkerQuery.getRandomResults(false);
        String whole = "{" +
                    "geonames: " + placeRandomResults + ", " +
                    "dists: " + distRandomResults + ", " +
                    "bounds: " + boundRandomResults + ", " +
                    "boundmarkers: " + bmRandomResults +
                "}";
        toBeJson(whole);
        return null;
    }

    public String randomPlacesResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = PlaceQuery.getRandomResults(isAdmin(request));
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String randomDistsResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = DistQuery.getRandomResults(isAdmin(request));
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String randomBoundsResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = BoundQuery.getRandomResults(isAdmin(request));
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String randomBoundMarkersResults() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = BoundMarkerQuery.getRandomResults(isAdmin(request));
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }


    public String wholeGeonames() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = null;
            if(isAdmin(request)) {
                str = PlaceQuery.getTotalTempGeonameInfo();
            } else {
                str = PlaceQuery.getTotalGeonameInfo();
            }
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String easyGeonames() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String str = null;
            if(isAdmin(request)) {
                str = PlaceQuery.getEasyTempGeonameInfo();
            } else {
                str = PlaceQuery.getEasyGeonameInfo();
            }
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    //	通过 request 的 geocode 参数，检索类型库并返回响应的类
    public String getGeonameByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String nameStr = request.getParameter("name");
            String str = PlaceQuery.getGeonameInfoByNickname(nameStr, isAdmin(request));
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameInfoByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String name = new String(request.getParameter("name").getBytes("iso-8859-1"));
            String str = PlaceQuery.getGeonameInfoByAttr("nickname" ,name, isAdmin(request));
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameFullByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String name = new String(request.getParameter("name").getBytes("iso-8859-1"));
            String str = PlaceQuery.getGeonameFullByAttr("nickname" ,name, isAdmin(request));
            String outStr = str.substring(1, str.length() - 1);
            toBeJson(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getGeonameFullById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = PlaceQuery.getGeonameInfoByNum("id" ,idStr, isAdmin(request));
            String outStr = str.substring(1, str.length() - 1);
            toBeJson(outStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }



    public String wholeDists() {
        String str = DistQuery.getTotalDistInfo();
        toBeJson("[" + str + "]");
        return null;
    }

    public String wholeEasyDists() {
        String str = DistQuery.getEasyDistInfo();
        toBeJson("[" + str + "]");
        return null;
    }

    public String getEasyDistInfoWithZeroChilds() {
        String str = DistQuery.getEasyDistInfoWithZeroChilds();
        toBeJson("[" + str + "]");
        return null;
    }

    public String getDistInfoByNickname() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String name = new String(request.getParameter("name").getBytes("iso-8859-1"));
            String str = DistQuery.getDistInfoByAttr("nickname" ,name);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getDistInfoByNum() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = DistQuery.getDistInfoByNum("Id", idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String wholeTypes() {

        HttpServletRequest request = ServletActionContext.getRequest();
        String webPath = ServletActionContext.getServletContext().getRealPath("/");
        String jsPath =  webPath + "data/placetypes_treedata.json";
        StringBuffer jsonBuf = new StringBuffer();
        File jFile=new File(jsPath);
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(jFile.getAbsolutePath()),"UTF-8"));
            String str=br.readLine();
            while(str!=null) {
                jsonBuf.append(str);
                str=br.readLine();
            }
            String json=jsonBuf.toString();
            br.close();
            this.toBeJson(json);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    public String wholeEasyBounds() {
        String str = BoundQuery.getEasyBoundsInfo();
        toBeJson(str);
        return null;
    }

    public String wholeBoundPaths() {
        String str = BoundQuery.getBoundPathsInfo();
        toBeJson(str);
        return null;
    }

    public String getBoundInfoById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
//            int id = Integer.parseInt(idStr);
            String str = BoundQuery.getBoundInfoByNum("Id", idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String wholeEasyBoundMarkers() {
        String str = BoundMarkerQuery.getEasyBoundMarkersInfo();
        toBeJson(str);
        return null;
    }

    public String getBoundMarkerInfoById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
            String str = BoundMarkerQuery.getBoundMarkerInfoByNum("Id", idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String getBoundMarkerRelateDistsById() {
        HttpServletRequest request = ServletActionContext.getRequest();
        try {
            String idStr = new String(request.getParameter("id").getBytes("iso-8859-1"));
//            int id = Integer.parseInt(idStr);
            String str = BoundMarkerQuery.getBoundMarkerRelatedDists(idStr);
            toBeJson(str);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ex.getMessage();
        }
        return null;
    }

    public String defInstanceJson() {
        return null;
    }


    // 将json格式字符串以json数据格式向 response 的 writer 输出
    public void toBeJson(String jsonStr){
        HttpServletResponse response = ServletActionContext.getResponse();
        response.setContentType("text/javascript");
        response.setCharacterEncoding("utf-8");
        try {
            PrintWriter out=response.getWriter();
            out.write(jsonStr);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //	将链表中的数据以json格式向 response 的 writer 输出
    public void toBeJson(List list,int total) throws Exception{
        HttpServletResponse response = ServletActionContext.getResponse();
        JSONObject jobj = new JSONObject();
        jobj.accumulate("total",total );
        jobj.accumulate("rows", list);
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(jobj.toString());
    }

    public static String subJson(String org, int startpage, int pagerows) {
        JSONObject data = JSONObject.fromString(org);
        String total = data.getString("total");
        JSONArray rows = data.getJSONArray("rows");
        int len = rows.length();
        int startId = (startpage - 1) * pagerows, eId = startId + pagerows;
        int endId = eId < len ? eId :len;
        StringBuffer json=new StringBuffer();
        json.append("{\"total\":");
        json.append(total);
        json.append(",\"rows\":[");
        for(int i = startId; i < endId; i++) {
            JSONObject ins = rows.getJSONObject(i);
            String jstr = ins.toString();
            json.append(jstr).append(",");
        }
        if(endId > startId) {
            json.deleteCharAt(json.length()-1);
        }
        json.append("]}");
        String str=json.toString();
        return str;
    }

    public static boolean isAdmin(HttpServletRequest request) {
        try {
            String adminStr = request.getParameter("admin");
            boolean admin = (adminStr != null && !"".equals(adminStr));
            return admin;
        } catch (Exception ex) {
            return false;
        }
    }

}
