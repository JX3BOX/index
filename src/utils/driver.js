import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { getMeta, setMeta } from "@/service/user.js";
import User from "@jx3box/jx3box-common/js/user";

const handleClose = async () => {
    if (User.isLogin()) {
        await setMeta("new_user_guide", 1);
    }
    localStorage.setItem("new_user_guide", 1);
};

const driverObj = driver({
    showProgress: false,
    nextBtnText: "下一步",
    prevBtnText: "上一步",
    doneBtnText: "完成",
    showButtons: ["next", "previous", "close"],
    steps: [
        {
            element: ".c-header-origin",
            popover: {
                title: "切换客户端",
                description: "可以在此处全局切换正式服（重制版）和怀旧服（缘起）喔~",
                side: "bottom",
                align: "start",
            },
        },
        {
            element: ".c-header-user",
            popover: {
                title: "个人中心",
                description: User.isLogin() ? "资料修改、福利兑换等在这里喔~" : "登录后可以查看个人资料喔~",
                side: "bottom",
                align: "start",
            },
        },
        {
            element: ".c-header-nav",
            popover: { title: "导航", description: "主要栏目可以在这里切换喔~", side: "bottom", align: "start" },
        },
        {
            element: ".m-box",
            popover: {
                title: "矩阵",
                description: "常用的应用可以在这里快速跳转，支持自定义喔~",
                side: "bottom",
                align: "start",
            },
        },
    ],
    onCloseClick: () => {
        handleClose();
        driverObj.destroy();
    },
    onDestroyStarted: () => {
        handleClose();
        driverObj.destroy();
    },
});

export default driverObj;
