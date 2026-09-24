import { useUI } from '../../context/UIContext'

export default function CartFly() {
  const { flyers } = useUI()
  return (
    <div className="pointer-events-none fixed inset-0 z-[95]">
      {flyers.map((f) => {
        const startX = f.from.left + f.from.width / 2 - 28
        const startY = f.from.top + f.from.height / 2 - 28
        const endX = f.to.left + f.to.width / 2 - 28
        const endY = f.to.top + f.to.height / 2 - 28
        return (
          <img
            key={f.id}
            src={f.image}
            alt=""
            className="absolute h-14 w-14 rounded-xl object-cover shadow-lg animate-fly-cart"
            style={{
              left: startX,
              top: startY,
              '--dx': `${endX - startX}px`,
              '--dy': `${endY - startY}px`,
            }}
          />
        )
      })}
    </div>
  )
}
