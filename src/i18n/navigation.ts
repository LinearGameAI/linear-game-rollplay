import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

//导出这些函数以便在页面中使用，替代next/navigation中的函数
export const { Link, redirect, useRouter, usePathname, getPathname } = createNavigation(routing)