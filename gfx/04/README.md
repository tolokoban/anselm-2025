# How to generate images for game 04

You should start Blender from a console. In the scripting tab, hit the Run button and wait.
Do this first with `hanoi-towers.blend` then with `compositing.blend`.

The first one will generate 81 WebP images in `frames/` folder.
The naming is the arrangement of the rings on the sticks. 1 is the largest ring, 4 the smallest.

So `13--24.webp` if the image with two rings on the left stick, and 2 rings on the right one.
And `1224--.webp` is the initial arrangement: all rings stacked on the left stick.

The second script (`compositing.blend`) will read all images in `frames/` and generate two images for each one in `render/`.
One image will have `.small.webp` extension and will be half the HD size. Both images will be compressed to gain space.
