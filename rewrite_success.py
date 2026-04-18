import re

# 1. ADD `.btn-outline` to style.css
with open('src/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

btn_outline_css = """
.btn-outline {
  background: transparent;
  color: var(--color-primary-dark);
  border: 2px solid var(--color-primary-dark);
}
.btn-outline:hover {
  background: var(--color-primary-dark);
  color: var(--color-white);
  transform: translateY(-2px);
}
"""
if '.btn-outline {' not in css:
    css = css.replace('.btn-secondary {', btn_outline_css + '\\n.btn-secondary {')
    with open('src/style.css', 'w', encoding='utf-8') as f:
        f.write(css)

# 2. Re-write the portal HTML string to fix btn-secondary and success screen
with open('AH_Wealth_Portal.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all occurrences of btn-secondary where it's used inside the white form cards or dashboard
html = html.replace('class="btn btn-secondary" onclick="window.location.href=\\'index.html\\'"', 'class="btn btn-outline" onclick="window.location.href=\\'index.html\\'"')
html = html.replace('class="btn btn-secondary" onclick="showScreen(\\'dash\\')"', 'class="btn btn-outline" onclick="showScreen(\\'dash\\')"')
html = html.replace('class="btn btn-secondary" style="font-size:12px"', 'class="btn btn-outline" style="font-size:12px"')
html = html.replace('class="btn btn-secondary" style="font-size:12px;color:var(--red);border-color:var(--red)"', 'class="btn btn-outline" style="font-size:12px;color:var(--color-primary-dark);border-color:var(--red)"')

old_success_pattern = re.compile(r'<div id="screen-success" class="screen">.*?</svg>\s*Contactar por WhatsApp\s*</a>\s*<div style="margin-top:18px"><button class="btn btn-[a-z]+" onclick="window\.location\.href=\'index\.html\'">.+?Volver al inicio</button></div>\s*</div>\s*</div>', re.DOTALL | re.IGNORECASE)

new_success = """<div id="screen-success" class="screen container" style="max-width: 600px; margin: 6rem auto;">
    <div class="form-card" style="text-align: center; padding: 4rem 2rem;">
      <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); color: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem; border: 2px solid rgba(16, 185, 129, 0.3);">
        ✓
      </div>
      <h3 style="font-family: var(--font-heading); color: var(--color-primary-dark); font-size: 2rem; margin-bottom: 1rem;">¡Formulario Recibido!</h3>
      <p style="color: var(--color-gray-dark); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
        Un especialista de A&H Wealth Group se comunicará con usted en menos de 24 horas por WhatsApp o email.
      </p>
      
      <div class="note-gold" style="border-radius: var(--radius-sm); border-left: none; border: 2px dashed var(--color-accent-gold); display: inline-block; padding: 1rem 2rem; margin-bottom: 2.5rem; background: var(--color-off-white);">
        <span style="font-size: 0.9rem; color: var(--color-gray); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.5rem;">Referencia</span>
        <div id="suc-ref" style="font-size: 1.25rem; color: var(--color-primary-dark); font-weight: 700;">#001 - TAX-01</div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
        <a class="btn btn-whatsapp" href="https://wa.me/17867941152?text=Hola,%20acabo%20de%20enviar%20mi%20formulario%20en%20el%20portal%20de%20A%26H" target="_blank" style="width: 100%; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contactar por WhatsApp
        </a>
        <button class="btn btn-outline" style="width: 100%; justify-content: center;" onclick="window.location.href='index.html'">
            ← Volver al inicio
        </button>
      </div>

    </div>
  </div>"""

html = old_success_pattern.sub(new_success, html)

with open('AH_Wealth_Portal.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Update success screen and add btn-outline successfully!")
