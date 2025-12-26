// 代码区域切换模块 - 处理代码编辑区的展开/收起功能

// 展开/收起代码区功能
export function initCodeToggle(toggleCodeBtn, svgCode) {
  toggleCodeBtn.addEventListener("click", () => {
    const isHidden = svgCode.classList.contains("hidden");

    if (isHidden) {
      svgCode.classList.remove("hidden");
      toggleCodeBtn.textContent = "收起";
    } else {
      svgCode.classList.add("hidden");
      toggleCodeBtn.textContent = "展开";
    }
  });
}
