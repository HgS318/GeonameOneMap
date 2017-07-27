package com.rs.geonameonemap.json;

import com.rs.geonameonemap.db.ms.SQLArgs.LocalConnection;
import com.rs.geonameonemap.db.mysql.connections.MysqlLocalConnection;

import java.sql.ResultSet;
import java.util.*;
import java.util.Map.Entry;

public class ObjectJson {

	public String name;
	public ObjectJson parent;
	public List<ObjectJson> subclasses = new LinkedList<ObjectJson>();
	public Map<String, String> attr = new HashMap<String, String>();
	public boolean open = false;
//	public Map<Integer, String> columnNames = new HashMap<Integer, String>();

	public static String[] numKeys = new String[]{"id", "position", "TSCG", "DXCG", "SJCG", "SJQJ", "SJHR",
			"SJDJ", "SJDS", "YGCG", "YGDS", "SWCG", "LTCG", "SYCG", "SPCG"};

	public ObjectJson() {
		
	}

	public ObjectJson(String _name) {
		name = _name;
	}

	public ObjectJson(String _name, ObjectJson par) {
		name = _name;
		this.simpleSetParent(par);
		par.simpleSetSub(this);
	}
	
	public ObjectJson(String _name, ObjectJson par, int order) {
		name = _name;
		this.simpleSetParent(par);
		par.simpleSetSub(this, order);
	}
	
	
	public static void main(String[] args) {
		ObjectJson root = new ObjectJson("武汉");
		
		ObjectJson hongshan = new ObjectJson("洪山区", root);
		ObjectJson luonan = new ObjectJson("珞南街道", hongshan);
		
		ObjectJson wuchang = new ObjectJson("武昌区", root);
		ObjectJson ziyang = new ObjectJson("紫阳街道", wuchang);
		
		String fulljson = root.toFullJson();
		String json = root.toJson();
		
		System.out.println(fulljson);
		System.out.println(json);
		
	}
	
	
	public String getName() {
		return name;
	}
	
	public void setName(String _name) {
		name = _name;
	}
	
	public String getAttr(String attrName) {
		return this.attr.get(attrName);
	}
	
	public void setAttr(String attrName, String attrValue) {
		this.attr.put(attrName, attrValue);
	}

	public void setAttr(String attrName, int intValue) {
		this.attr.put(attrName, String.valueOf(intValue));
	}
	
	
	public void setParent(ObjectJson par) {
		this.simpleSetParent(par);
		par.simpleSetSub(this);
	}
	
	public void setSub(ObjectJson sub) {
		sub.simpleSetParent(this);
		this.simpleSetSub(sub);
	}

	public void setSub(ObjectJson sub, int order) {
		sub.simpleSetParent(this);
		this.simpleSetSub(sub, order);
	}
	
	
	public void simpleSetParent(ObjectJson par) {
		this.parent = par;
	}
	
	public void simpleSetSub(ObjectJson sub, int order) {
		int idx = this.subclasses.indexOf(sub);
		if(idx > -1) {
			this.subclasses.add(order, sub);
		} else {
			this.subclasses.add(order, sub);
		}
	}

	public void simpleSetSub(ObjectJson sub) {
		int idx = this.subclasses.indexOf(sub);
		if(idx > -1) {
			this.subclasses.remove(idx);
			this.subclasses.add(idx, sub);
		} else {
			this.subclasses.add(sub);
		}
	}
	
	public String toFullJson() {
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
//		json.append(",\"state\":\"closed\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name).append("\"");
		}
		if(this.open) {
			json.append(",\"state\":\"open\"");
		} else {
			if(this.subclasses.size() < 1) {
				json.append(",\"state\":\"open\"");
			} else {
				json.append(",\"state\":\"closed\"");
			}
		}
		for (Entry<String, String> entry: attr.entrySet()) {
		    String key = entry.getKey();
			if( "name".equalsIgnoreCase(key)) {
				continue;
			}
		    String value = entry.getValue();
		    if(value != null && !"".equals(value)) {
		    	json.append(",").append(jsonKeyValue(key, value));
		    }
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append(sub.toFullJson()).append(",");
			}
			json.deleteCharAt(json.length() - 1);
			json.append("]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	public String toFullJson(Collection<String> columns) {
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name).append("\"");
		}
		if(this.open) {
			json.append(",\"state\":\"open\"");
		} else {
			if(this.subclasses.size() < 1) {
				json.append(",\"state\":\"open\"");
			} else {
				json.append(",\"state\":\"closed\"");
			}
		}
		for(String column : columns) {
			if( "name".equalsIgnoreCase(column)) {
				continue;
			}
			String tmpVal = this.attr.get(column);
			String val = tmpVal != null ? tmpVal : "";
			json.append(",").append(jsonKeyValue(column, val));
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append(sub.toFullJson()).append(",");
			}
			json.deleteCharAt(json.length() - 1);
			json.append("]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	public String toJson() {
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name);
		}
		for (Entry<String, String> entry: attr.entrySet()) {
		    String key = entry.getKey();
			if( "name".equalsIgnoreCase(key)) {
				continue;
			}
		    String value = entry.getValue();
		    if(value!=null && !"".equals(value)) {
		    	json.append(",").append(jsonKeyValue(key, value));
		    }
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append("\"").append(sub.name).append("\",");
			}
			json.deleteCharAt(json.length()-1);
			json.append("}]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	public String toJson(String[] useColumns) {
		List<String> cos = new LinkedList<String>();
		for(String col : useColumns) {
			cos.add(col);
		}
		StringBuffer json=new StringBuffer();
		json.append("{");
		json.append("\"name\":\"").append(this.name).append("\"");
		if(parent != null) {
			json.append(",\"parent\":\"").append(this.parent.name);
		}
		for (Entry<String, String> entry: attr.entrySet()) {
			String key = entry.getKey();
			if(!cos.contains(key) || "name".equalsIgnoreCase(key)) {
				continue;
			}
			String value = entry.getValue();
			if(value!=null && !"".equals(value)) {
				json.append(",").append(jsonKeyValue(key, value));
			}
		}
		if(this.subclasses.size() > 0) {
			json.append(",\"children\":[");
			for(ObjectJson sub : this.subclasses) {
				json.append("\"").append(sub.name).append("\",");
			}
			json.deleteCharAt(json.length()-1);
			json.append("}]");
		}
		json.append("}");
		String str=json.toString();
		return str;
	}

	
	public String jsonKeyValue(String key, String value) {
		boolean flag = false;
		for(String numkey : numKeys) {
			if(numkey.equals(key)) {
				flag = true;
				break;
			}
		}
		if(flag) {
			return "\"" + key + "\":" + value;
		} else {
			return "\"" + key + "\":\"" + value +"\"";
		}
	}
	
	public boolean equals(Object obj) {
		if(obj == this) {
			return true;
		}
		if(!(obj instanceof ObjectJson)) {
			return false;
		}
		ObjectJson jo = (ObjectJson)obj;
		if(!strEquals(name,jo.name)) {
			return false;
		}
		return this.parent == jo.parent;
		
	}


	public static void consColumnNames(List<String> columns, Map<Integer, String> columnNames) {
		if(columnNames == null || columnNames.size() > 0) {
			return;
		}
		for(int i = 0; i < columns.size(); i++) {
			String column = columns.get(i);
			if(!"".equals(column)) {
				columnNames.put(i, column);
			}
		}
	}

	public static void consColumnNames(String dbType, String tbName, Map<Integer, String> columnNames) {
		if(columnNames == null || columnNames.size() > 0) {
			return;
		}
		String sql = null;
		ResultSet rs = null;
		if("mysql".equalsIgnoreCase(dbType)) {
			sql = "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_name='" + tbName + "'";
			rs = MysqlLocalConnection.executeQuery(sql);
		} else {
			sql = "Select Name FROM SysColumns Where id=Object_Id('" + tbName + "')";
			rs = LocalConnection.executeQuery(sql);
		}
		int i = 0;
		try {
			while (rs.next()) {
				String columnName = rs.getString(1);
				columnNames.put(i, columnName);
				i++;
			}
			rs.close();
		} catch (Exception se) {
			se.printStackTrace();
			System.err.println("产生列名失败！！！");
		}
	}

	public static boolean strEquals(String str1, String str2) {
		if(str1 == null) {
			return str2 == null;
		}
		return str1.equals(str2);
	}

	public static ObjectJson findObj(List<ObjectJson> data, String name) {
		for(ObjectJson jo : data) {
			if(name.equals(jo.name)) {
				return jo;
			}
		}
		return null;
	}

	public static ObjectJson findObj(Object[] data, String name) {
		for(Object obj : data) {
			if(obj instanceof ObjectJson) {
				ObjectJson jo = (ObjectJson)obj;
				if(name.equals(jo.name)) {
					return jo;
				}
			}
		}
		return null;
	}

}
