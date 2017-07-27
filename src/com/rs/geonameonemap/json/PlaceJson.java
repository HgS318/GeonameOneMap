package com.rs.geonameonemap.json;

import com.rs.geonameonemap.db.ms.SQLArgs.LocalConnection;
import org.omg.CORBA.CODESET_INCOMPATIBLE;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class PlaceJson extends ObjectJson {


	protected static Map<Integer, String> columnNames = new HashMap<Integer, String>();

	public static String[] fuzzyInfoCol = new String[] {
			"name", "ChnSpell"
	};
	public static String[] exactInfoCol = new String[] {
			"id", "标准名称", "dist",
	};


	public PlaceJson() {
		
	}

	public PlaceJson(List<String> data) {
		for(int i = 0; i < data.size(); i++) {
			String key = columnNames.get(i);
			if(key == null || "".equals(key)) {
				continue;
			}
			String tmpValue = data.get(i);
			tmpValue = tmpValue.replace('\"', '\'');
			String value = null;
			value = tmpValue.replace("\n", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;");
			if(key.equals("position")) {
				value = "[" + value +"]";
			}
			this.attr.put(key, value);
		}
		if(columnNames.containsValue("name")) {
			this.name = this.getAttr("name");
		}
		if(columnNames.containsValue("地名含义")) {
			String str = this.getAttr("地名含义");
			if(str != null && str.length() > 23) {
				str = str.substring(0, 23) + "...";
			}
			this.attr.put("desc", str);
		}
	}

	public PlaceJson(ResultSet rs) {
		for(int i = 0; i < columnNames.size(); i++) {
			String key = columnNames.get(i);
			Object obj = null;
			try {
				obj = rs.getObject(key);
			} catch (SQLException se) {
				continue;
			}
			if(obj == null) {
				continue;
			}
			String tmpValue = obj.toString();
			if(tmpValue == null || "".equals(tmpValue)) {
				continue;
			}
			tmpValue = tmpValue.replace('\"', '\'');
			String value = null;
			value = tmpValue.replace("\n", "<br/>");
			if(key.equals("position")) {
				value = "[" + value +"]";
			}
			if(key.equalsIgnoreCase("name")) {
				this.name = value;
			}
			this.attr.put(key, value);
		}
	}

	public static String toJson(List<PlaceJson> ps) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(PlaceJson pj : ps) {
			String pjStr = pj.toJson();
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static String toJson(List<PlaceJson> ps, String[] useColumns) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(PlaceJson pj : ps) {
			String pjStr = pj.toJson(useColumns);
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}

	public static String toFullJson(List<PlaceJson> ps) {
		StringBuffer sb = new StringBuffer();
		sb.append('[');
		for(PlaceJson pj : ps) {
			String pjStr = pj.toFullJson(PlaceJson.columnNames.values());
			sb.append(pjStr).append(",");
		}
		sb.replace(sb.length() - 1, sb.length(), "]");
		return sb.toString();
	}




//	public static void main(String[] args) {
//		List<PlaceJson> ps = new LinkedList<PlaceJson>();
//		List<List<String>> data = null;
//		try {
//			data = ExcelDemo02.readExcel("data/placesdemo01.xlsx","Sheet1");
//		} catch (IOException e) {
//			e.printStackTrace();
//			return;
//		}
//		List<String> columns = data.get(0);
//		consVolumnNames(columns);
//		for(int i = 1; i < data.size(); i++) {
//			List<String> pdata = data.get(i);
//			PlaceJson pj = new PlaceJson(pdata);
//			if(pj.getAttr("name")!=null && !"".equals(pj.getAttr("name"))) {
//				ps.add(pj);
//			}
//		}
//
//
////		System.out.print("{\'total\':" + ps.size() +", ");
////		System.out.print("\'places\':");
//		System.out.println("[");
//		for(PlaceJson pj : ps) {
//			System.out.println(pj.toJson() + ",");
//		}
//		System.out.println("]");
////		System.out.println("}");
//	}

	public static void consColumnNames(List<String> columns) {
		ObjectJson.consColumnNames(columns, PlaceJson.columnNames);
	}

	public static void consColumnNames(String tbName) {
		ObjectJson.consColumnNames(tbName, PlaceJson.columnNames);
	}

}
