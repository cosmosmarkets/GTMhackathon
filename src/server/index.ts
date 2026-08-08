import { renderTile } from '../tiles/render'
import { parseCoords } from './coords'

export function handle(request: Request): Response {
  const { z, x, y } = parseCoords(request.url)
  return new Response(renderTile(z, x, y))
}
