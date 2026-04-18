import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract <nav>
nav_match = re.search(r'<nav class="navbar"[^>]*>.*?</nav>', index_content, re.DOTALL)
navbar = nav_match.group(0) if nav_match else ''

# Extract <footer>
footer_match = re.search(r'<footer class="footer"[^>]*>.*?</footer>', index_content, re.DOTALL)
footer = footer_match.group(0) if footer_match else ''

with open('AH_Wealth_Portal.html', 'r', encoding='utf-8') as f:
    portal_content = f.read()

# 1. Replace the entire <head> section up to <body>
new_head = """<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A&H Wealth Group LLC - Portal Cliente</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/src/style.css">
    <link rel="icon" type="image/jpeg" href="/logo.jpg">
    <style>
        /* Additional portal-specific styles injected to match index.html aesthetics */
        body { background-color: var(--color-off-white); font-family: var(--font-body); }
        .screen { display: none; }
        .screen.active { display: block; animation: fadeIn 0.4s ease; }
        
        .sec-bar { display: flex; align-items: baseline; gap: 9px; border-bottom: 2px solid var(--color-gray-light); padding-bottom: 5px; margin: 2rem 0 1rem; }
        .sec-bar::before { content: ''; width: 4px; height: 16px; background: var(--color-accent-gold); border-radius: 2px; flex-shrink: 0; }
        .sec-es { font-size: 1.1rem; font-weight: 700; color: var(--color-primary-dark); }
        .sec-en { font-size: 0.85rem; color: var(--color-gray); font-style: italic; }
        
        .fg { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .f { margin-bottom: 1rem; }
        .f label { display: block; font-weight: 600; color: var(--color-primary-dark); margin-bottom: 0.5rem; font-size: 0.95rem; }
        .f label em { font-style: italic; font-weight: 400; color: var(--color-gray); margin-left: 5px; }
        .f input, .f select, .f textarea { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--color-gray-light); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; color: var(--color-gray-dark); transition: all 0.3s ease; background-color: var(--color-white); }
        .f input:focus, .f select:focus, .f textarea:focus { border-color: var(--color-accent-gold); outline: none; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15); }
        .f textarea { min-height: 100px; resize: vertical; }

        .cw { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
        .chip { padding: 0.5rem 1rem; border: 1.5px solid var(--color-gray-light); border-radius: var(--radius-full); cursor: pointer; color: var(--color-gray-dark); background: var(--color-white); transition: all 0.2s ease; font-size: 0.9rem; font-weight: 500; }
        .chip:hover { border-color: var(--color-accent-gold); color: var(--color-primary-dark); }
        .chip.on { background: var(--color-primary-dark); border-color: var(--color-primary-dark); color: var(--color-accent-gold); }
        
        .note-gold { background: var(--color-accent-gold-light); border-left: 4px solid var(--color-accent-gold); padding: 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; color: var(--color-accent-gold-dark); font-weight: 600; margin: 1rem 0; font-size: 0.95rem; }
        
        .fhdr { background: var(--gradient-primary); padding: 1.5rem 2rem; border-bottom: 3px solid var(--color-accent-gold); display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
        .fhdr-ico { width: 48px; height: 48px; background: rgba(212, 175, 55, 0.15); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; color: var(--color-accent-gold); border: 1px solid rgba(212, 175, 55, 0.3); }
        .fhdr h2 { color: var(--color-white); font-size: 1.5rem; margin-bottom: 0.2rem; font-family: var(--font-heading);}
        .fhdr p { color: rgba(255,255,255,0.7); font-size: 0.9rem; font-style: italic; margin-bottom: 0; }
        
        .fbody { padding: 2rem; }
        
        .form-card { padding: 0; background: var(--color-white); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; margin: 4rem auto; max-width: 900px; border: 1px solid var(--color-gray-light); }
        
        .btn-row { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-gray-light); }
        
        .dp { background: var(--color-white); border: 1px solid var(--color-gray-light); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1rem; box-shadow: var(--shadow-md); }
        .dp-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-gray-light); }
        .dr { display: flex; justify-content: space-between; align-items: baseline; padding: 0.5rem 0; border-bottom: 1px solid var(--color-gray-light); font-size: 0.95rem; }
        .dr:last-child { border-bottom: none; }
        .dk { color: var(--color-gray); width: 45%; font-weight: 500; }
        .dv { color: var(--color-primary-dark); font-weight: 600; text-align: right; }
        
        @media(max-width: 620px){ .fg { grid-template-columns: 1fr; } .btn-row { flex-direction: column-reverse; gap: 1rem; } .btn-row button { width: 100%; } }
        
        /* Table Styles for Dashboard */
        .tw { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: 2rem;}
        thead th { background: var(--color-primary-dark); color: var(--color-white); padding: 0.75rem 1rem; text-align: left; font-weight: 600; white-space: nowrap; }
        tbody td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-gray-light); color: var(--color-gray-dark); }
        tbody tr:hover td { background: var(--color-off-white); }
        .dash-badge { display: inline-block; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); letter-spacing: 0.5px; }
        .b-navy { background: rgba(26, 41, 66, 0.1); color: var(--color-primary); border: 1px solid rgba(26, 41, 66, 0.2); }
        .b-gold { background: var(--color-accent-gold-light); color: var(--color-accent-gold-dark); border: 1px solid var(--color-accent-gold); }
        .b-green { background: rgba(16, 185, 129, 0.1); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.3); }
        .b-gray { background: var(--color-gray-light); color: var(--color-gray-dark); }
        
        .tbl-btn { font-size: 0.8rem; padding: 0.4rem 0.8rem; border: 1.5px solid var(--color-gray-light); border-radius: var(--radius-sm); background: var(--color-white); cursor: pointer; color: var(--color-primary-dark); font-weight: 600; transition: all 0.2s; }
        .tbl-btn:hover { border-color: var(--color-accent-gold); color: var(--color-accent-gold-dark); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        
        .filter-sel { font-size: 0.9rem; padding: 0.5rem 1rem; border: 2px solid var(--color-gray-light); border-radius: var(--radius-sm); background: var(--color-white); color: var(--color-primary-dark); outline: none; font-weight: 600; cursor: pointer; }
        .filter-sel:focus { border-color: var(--color-accent-gold); }
        
        .stats-g { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat { background: var(--color-white); border: 1px solid var(--color-gray-light); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm); border-top: 4px solid var(--color-primary-dark); }
        .stat.gold { border-top-color: var(--color-accent-gold); }
        .stat-lbl { font-size: 0.85rem; color: var(--color-gray); font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-val { font-family: var(--font-heading); font-size: 2.5rem; color: var(--color-primary-dark); line-height: 1; font-weight: 700; }
        .stat-sub { font-size: 0.8rem; color: var(--color-gray); margin-top: 0.5rem; }
        
        /* Container for dashboard */
        .dash-container { max-width: 1200px; margin: 4rem auto; padding: 0 20px;}
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .dash-title { font-family: var(--font-heading); color: var(--color-primary-dark); font-size: 2.5rem; }
    </style>
</head>
<body style="background-color: var(--color-off-white);">
"""

portal_body = re.sub(r'<!DOCTYPE html>.*?<body[^>]*>', new_head, portal_content, flags=re.DOTALL)

# 2. Add navbar right after <body>
if navbar:
    portal_body = portal_body.replace('<div class="topbar">', navbar + '\\n<div class="topbar" style="display:none;">')

# 3. Add footer right before </body>
if footer:
    portal_body = portal_body.replace('</body>', footer + '\\n</body>')

# 4. Remove the old .footer div
portal_body = re.sub(r'<div class="footer">.*?</div>', '', portal_body, flags=re.DOTALL)

# 5. Fix form containers - wrap in container
portal_body = portal_body.replace('<div id="screen-tax1" class="screen">', '<div id="screen-tax1" class="screen container">')
portal_body = portal_body.replace('<div id="screen-tax2" class="screen">', '<div id="screen-tax2" class="screen container">')
portal_body = portal_body.replace('<div id="screen-bk" class="screen">', '<div id="screen-bk" class="screen container">')
portal_body = portal_body.replace('<div id="screen-credit" class="screen">', '<div id="screen-credit" class="screen container">')
portal_body = portal_body.replace('<div id="screen-diag" class="screen">', '<div id="screen-diag" class="screen container">')

# Modify Dashboard wrapper
portal_body = portal_body.replace('<div id="screen-dash" class="screen">', '<div id="screen-dash" class="screen dash-container">')

# Replace inline CSS buttons for Regresar and others
portal_body = portal_body.replace('btn btn-outline', 'btn btn-secondary')

with open('AH_Wealth_Portal_new.html', 'w', encoding='utf-8') as f:
    f.write(portal_body)

print("Created AH_Wealth_Portal_new.html")