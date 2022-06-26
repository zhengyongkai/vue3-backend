export function validateWholeNumber(rule, value, callback) {
  const pattern = /^[+]{0,1}(\d+)$/;

  if (pattern.test(value) || !value) {
    callback();
  } else {
    callback("请输入正整数");
  }
}
