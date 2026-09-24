// Soft gate for individual private pages, so opening one by its URL asks for
// the code instead of showing the page. Same caveat as the /private hub: this
// is a static site, so the codes and the gated markup are readable in the
// page source. It keeps casual visitors out; it is not access control.
//
// Usage, in <head>:
//   <script src="/private-gate.js" data-key="kinship" data-codes="1887,1959"></script>
// A code unlocks the page for the rest of the browser tab (sessionStorage).
// The hub's code (1887) unlocks every private page; the hub sets 'pv-ok-all'.
;(function () {
  var script = document.currentScript
  var key = 'pv-ok-' + (script.dataset.key || location.pathname)
  var codes = (script.dataset.codes || '1887').split(',')

  function unlocked() {
    try {
      return sessionStorage.getItem('pv-ok-all') === '1' || sessionStorage.getItem(key) === '1'
    } catch (e) {
      return false
    }
  }
  if (unlocked()) return

  var root = document.documentElement
  root.classList.add('pv-locked')
  var style = document.createElement('style')
  style.textContent =
    'html.pv-locked body{visibility:hidden}' +
    'html.pv-locked body{overflow:hidden}' +
    '#pv-lock{visibility:visible;position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:1.25rem;background:#f9f9f7;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '#pv-lock .box{max-width:22rem;text-align:center;background:#fff;border:1px solid rgba(0,0,0,.35);border-radius:12px;padding:1.75rem 1.5rem;color:#0b0b0b}' +
    '#pv-lock h1{font-size:1.3rem;margin:0 0 .6rem}' +
    '#pv-lock p{color:#52514e;font-size:.9rem;margin:0 0 1rem}' +
    '#pv-lock form{display:flex;justify-content:center;gap:.5rem}' +
    '#pv-lock input{width:7rem;padding:.45rem .65rem;border-radius:8px;border:2px solid rgba(0,0,0,.35);font-size:.9rem;text-align:center;background:#fff;color:#0b0b0b}' +
    '#pv-lock button{font-weight:600;background:#bf141c;color:#fff;border:none;border-radius:8px;padding:.45rem 1rem;cursor:pointer}' +
    '#pv-lock .err{color:#bf141c;font-weight:600;font-size:.85rem;margin:.75rem 0 0}' +
    '@media (prefers-color-scheme:dark){#pv-lock{background:#0d0d0d}#pv-lock .box{background:#1a1a19;color:#fff;border-color:rgba(255,255,255,.2)}#pv-lock p{color:#c3c2b7}#pv-lock input{background:#0d0d0d;color:#fff;border-color:rgba(255,255,255,.35)}}'
  document.head.appendChild(style)

  function mount() {
    var lock = document.createElement('div')
    lock.id = 'pv-lock'
    lock.innerHTML =
      '<div class="box"><h1>Private page</h1>' +
      "<p>This page isn't intended for public use. Enter the access code to continue.</p>" +
      '<form><input type="password" inputmode="numeric" autocomplete="off" placeholder="Code" aria-label="Access code">' +
      '<button type="submit">Enter</button></form>' +
      '<p class="err" hidden>That code isn’t right — try again.</p></div>'
    document.body.appendChild(lock)
    var input = lock.querySelector('input')
    var err = lock.querySelector('.err')
    input.focus()
    lock.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault()
      if (codes.indexOf(input.value.trim()) === -1) {
        err.hidden = false
        input.value = ''
        input.focus()
        return
      }
      try {
        sessionStorage.setItem(input.value.trim() === '1887' ? 'pv-ok-all' : key, '1')
      } catch (e2) {}
      lock.remove()
      root.classList.remove('pv-locked')
      // charts laid out while hidden keep their size; nudge anything that
      // listens for resize to redraw now that the page is visible
      window.dispatchEvent(new Event('resize'))
    })
  }
  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount)
})()
