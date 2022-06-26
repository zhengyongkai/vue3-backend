import { uploadFile } from "../api/upload";
import { ElNotification } from "element-plus";

export const getParamsNotNull = (obj) => {
  for (var key in obj) {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};

export const uploadImg = (formData) => {
  return uploadFile(formData);
};

/**
 * 返回数据处理
 * @param   {json}      json数据
 * @return  {Boolean}   返回状态
 */

export function responseNotify(res) {
  if (!res || !res.success) {
    ElNotification({
      title: "Error",
      message: "This is an error message",
      type: "error",
    });
    return false;
  }
  return true;
}
/**
 * 排序
 * @param   {String}     需要排序的字段
 * @return  {Function}   返回排序的方法
 */
export const compare = (property) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
};

/**
 * 菜单排序
 * @param   {json}      json数据
 * @param   {String}    id的字符串
 * @param   {String}    父id的字符串
 * @param   {String}    children的字符串
 * @return  {Array}     数组
 */
export const transData = (a, idStr, pidStr, childrenStr) => {
  var r = [],
    hash = {},
    id = idStr,
    pid = pidStr,
    children = childrenStr,
    i = 0,
    j = 0,
    len = a.length;
  for (; i < len; i++) {
    hash[a[i][id]] = a[i];
  }
  for (; j < len; j++) {
    var aVal = a[j],
      hashVP = hash[aVal[pid]];
    if (hashVP ) {
      !hashVP[children] && (hashVP[children] = []);
      aVal.parentsNode = hashVP;
      // 如果菜单是按钮，则不添加他的子菜单
      if( hashVP.menuType != '1'){
        continue
      }
      hashVP[children].push(aVal);
      hashVP[children] = hashVP[children].sort(compare("order"));
    } else {
      r.push(aVal);
      r = r.sort(compare("order"));
    }
  }
  return r;
};
