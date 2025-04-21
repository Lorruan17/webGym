"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GiWeightLiftingUp } from "react-icons/gi";
import { FaUtensils } from "react-icons/fa";
import styles from "./bottom.module.css";

const navItems = [
  { key: "/user/app", label: "Início", icon: <HomeOutlined /> },
  { key: "/user/treino", label: "Treino", icon: <GiWeightLiftingUp /> },
  { key: "/user/dieta", label: "Dieta", icon: <FaUtensils /> },
  { key: "/user/perfil", label: "Perfil", icon: <UserOutlined /> },
];

export default function BottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={styles.footer}>
      {navItems.map((item) => {
        const isActive = pathname === item.key;
        return (
          <div
            key={item.key}
            onClick={() => router.push(item.key)}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
          >
            <div className={styles.icon}>{item.icon}</div>
            <span className={styles.label}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
