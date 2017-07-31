package test;

import java.util.HashSet;
import java.util.Random;

/**
 * 使用HashSet实现
 * @Description:

 * @File: Test.java

 * @Package None

 * @Author Hanyonglu

 * @Date 2012-10-18 下午06:11:41

 * @Version V1.0
 */
public class Demo4 {

    static int len = 20;

    public static void main(String[] args) {
        Random random = new Random();
        Object[] values = new Object[4];
        HashSet<Integer> hashSet = new HashSet<Integer>();
        // 生成随机数字并存入HashSet
        for(int i = 0;i < values.length;i++){
            int number = random.nextInt(4) + 1;
            hashSet.add(number);
        }
        values = hashSet.toArray();
        // 遍历数组并打印数据
        for(int i = 0;i < values.length;i++){
            System.out.print(values[i] + "\t");
            if(( i + 1 ) % 10 == 0){
                System.out.println("\n");
            }
        }
    }
}