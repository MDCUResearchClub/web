import styles from "./Loading.module.css";

export default function Loading({
  colorClass = "bg-white",
}: {
  colorClass?: string;
}) {
  const dotClass = `absolute w-3 h-3 top-4 rounded-full ${colorClass}`;
  return (
    <div className={`${styles.loading} relative inline-block w-20 h-12`}>
      <div className={dotClass}></div>
      <div className={dotClass}></div>
      <div className={dotClass}></div>
      <div className={dotClass}></div>
    </div>
  );
}
