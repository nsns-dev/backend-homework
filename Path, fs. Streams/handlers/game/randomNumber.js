export default function random() {
  return Math.round(Math.random() * 100) < 50 ? 1 : 2
}