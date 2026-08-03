# Globe land-point assets

The `land-points-*.bin` files are generated from the Natural Earth 1:50m land
dataset, version 5.1.2. Natural Earth data is in the public domain.

Source:
<https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson>

Regenerate the quality variants with:

```bash
pnpm generate:globe-points
```

Binary layout:

- bytes 0–3: unsigned 32-bit little-endian point count;
- remaining bytes: repeated signed 16-bit little-endian latitude and longitude;
- coordinates are quantized by a factor of 100.
