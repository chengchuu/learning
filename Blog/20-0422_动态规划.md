# 对数据进行模糊匹配搜索 (动态规划、最长公共子串、最长公共子序列)

在搜索时常常在输入一半或者输入错误时，搜索引擎就给出智能提示。

![搜索框](http://blog.mazey.net/wp-content/uploads/2020/04/search-10.49.11.png)

已知的搜索推荐主要包括以下几个方面:

- 包含: "清华" 和 "清华大学"
- 相似: "聊天软件" 和 "通讯软件"
- 相关: "明星" 和 "刘亦菲"
- 纠错: "好奇害死毛" 和 "好奇害死猫"

其中包含模糊匹配可以使用动态规划算法解决，其他几个则要大量数据进行机器学习才行。

倘若要在一堆数据中对一个关键词进行匹配搜索，传统做法是把数据拆分开，然后遍历他们，看看是否包含这个关键词，对于 "fin" 和 "finish" 这样存在包含关系的单词来说是没问题的，但是对于 "fish" 和 "finish" 这样并不存在包含关系的单词就失效了，这时候期望计算出两个单词的相似性，比如 "fish" 和 "finish" 都包含 "ish"，"ish" 的长度是 3，可以理解相似性为 3。目前主流做法是通过最长公共子串来寻找两个或多个已知字符串**最长**的子串。

最长公共子串示例:

```javascript
/**
 * @method lcsSubstring
 * @description 计算两个字符串的最长公共子串
 * @param {String} a 字符串
 * @param {String} b 字符串
 * @return {Number} 长度
 */
function lcsSubstring(a, b) {
  const m = a.length;
  const n = b.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let maxLen = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        maxLen = Math.max(maxLen, dp[i][j]);
      }
    }
  }
  return maxLen;
}

lcsSubstring("fish", "finish"); // 3
```

"fish" 和 "finish" 除了 "ish" 之外还共同包含 "f"，所以 "ish" + "f" 更好的表达其相似性（3 + 1 = 4），于是使用最长公共子序列对最长公共子串进行升级来查找所有序列中最长子序列，版本管理中使用的 `git diff` 就是建立在最长公共子序列的基础上。

最长公共子序列示例:

```javascript
/**
 * @method lcsSubsequence
 * @description 计算两个字符串的最长公共子序列
 * @param {String} a 字符串
 * @param {String} b 字符串
 * @return {Number} 长度
 */
function lcsSubsequence(a, b) {
  const m = a.length;
  const n = b.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

lcsSubsequence("fish", "finish"); // 4
```
