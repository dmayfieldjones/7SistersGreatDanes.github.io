// A small strip at the top of each page in the Great Dane diversity project, so
// a visitor always sees where they are and what comes next.
// Usage in <head>: <script src="/project-nav.js" data-current="map" defer></script>
;(function () {
  var cur = document.currentScript && document.currentScript.dataset.current
  var steps = [
    ['map', '1', 'The Map', '/breed-map.html', 'See who is related to whom'],
    ['history', '2', 'The History', '/breeding-history.html', 'How the breed got here'],
    ['study', '3', 'The Evidence', '/private/kinship-study', 'Methods and numbers'],
    ['proposal', '4', 'The Plan', '/sequencing-proposal.html', 'What we would sequence and why']
  ]
  function build() {
    var nav = document.createElement('nav')
    nav.setAttribute('aria-label', 'Great Dane diversity project')
    nav.className = 'pj-nav'
    var html = '<a class="pj-home" href="/private">Project overview</a><ol>'
    steps.forEach(function (s) {
      html += '<li' + (s[0] === cur ? ' class="on" aria-current="page"' : '') + '><a href="' + s[3] + '" title="' + s[4] + '"><b>' + s[1] + '</b> ' + s[2] + '</a></li>'
    })
    nav.innerHTML = html + '</ol>'
    var st = document.createElement('style')
    st.textContent =
      '.pj-nav{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;padding:8px 16px;border-bottom:1px solid rgba(128,128,128,.3);background:#fff;color:#0b0b0b;font:14px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '.pj-nav a{color:inherit;text-decoration:none}.pj-nav .pj-home{color:#52514e;text-decoration:underline}' +
      '.pj-nav ol{display:flex;flex-wrap:wrap;gap:4px 14px;margin:0;padding:0;list-style:none}' +
      '.pj-nav li a{display:inline-block;padding:3px 10px;border-radius:999px;border:1px solid transparent}' +
      '.pj-nav li a b{display:inline-block;width:1.4em;text-align:center;border-radius:50%;background:rgba(128,128,128,.25);margin-right:2px}' +
      '.pj-nav li.on a{border-color:#0b0b0b;font-weight:600}.pj-nav li.on a b{background:#bf141c;color:#fff}' +
      '@media (prefers-color-scheme:dark){.pj-nav{background:#141413;color:#f0efec}.pj-nav .pj-home{color:#c3c2b7}.pj-nav li.on a{border-color:#f0efec}}' +
      '@media (max-width:640px){.pj-nav{padding:8px 12px}.pj-nav li a{padding:6px 8px}}'
    document.head.appendChild(st)
    document.body.insertBefore(nav, document.body.firstChild)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build)
  else build()
})()
