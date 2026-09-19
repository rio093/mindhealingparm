"""Product cutout + new background compositor.
usage: python3 cutout.py <input> <out-name> <blend a|b|c|hero>
- rembg removes the studio background (누끼)
- tight crop with padding, then composited on a brand-tint canvas (sand → blend tint gradient, soft floor shadow)
- exports assets/<name>.webp (1200px) and assets/<name>-cut.png (transparent, for reuse). Requires: pip install rembg onnxruntime pillow
"""
import sys, io
from PIL import Image, ImageFilter, ImageDraw
from rembg import remove, new_session
src, name, blend = sys.argv[1], sys.argv[2], sys.argv[3]
TINT={'a':(230,235,220),'b':(223,233,230),'c':(241,232,214),'hero':(239,235,224)}
SAND=(245,242,234)
im=Image.open(src).convert('RGB'); im.thumbnail((2400,2400))
sess=new_session('isnet-general-use')
cut=remove(im, session=sess, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10, alpha_matting_erode_size=8)
bbox=cut.getbbox(); cut=cut.crop(bbox)
cut.save(f'assets/{name}-cut.png')
# canvas 4:5 with the product ~64% of height
W,H=1200,1500
canvas=Image.new('RGB',(W,H),SAND)
# vertical gradient sand -> tint
g=Image.new('RGB',(1,H)); px=g.load()
for y in range(H):
    t=y/(H-1); px[0,y]=tuple(round(SAND[i]*(1-t)+TINT[blend][i]*t) for i in range(3))
canvas.paste(g.resize((W,H)))
scale=(H*0.64)/cut.height; pw,ph=round(cut.width*scale),round(cut.height*scale)
prod=cut.resize((pw,ph),Image.LANCZOS)
x,y=(W-pw)//2,round(H*0.20)
# soft floor shadow
sh=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(sh)
d.ellipse([x-pw*0.05,y+ph-ph*0.04,x+pw*1.05,y+ph+ph*0.06],fill=(38,37,30,70))
sh=sh.filter(ImageFilter.GaussianBlur(28))
canvas=Image.alpha_composite(canvas.convert('RGBA'),sh)
canvas.alpha_composite(prod,(x,y))
out=canvas.convert('RGB'); out.save(f'assets/{name}.webp',quality=86,method=6)

print(name, cut.size, '->', out.size)
