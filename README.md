Countries from DSS

```
gc -Encoding UTF8  '.\Lande-(ISO-3166).txt' |ConvertFrom-Csv  -Delimiter `t   |foreach { "yield return new IsoCountry { IsoCode = `"" + $_."ALPHA-2" + "`", CountryName = `"" + $_.ISO_3166_DA + "`" };"  }
```

# Newlines at end of file are bad in this folder!
In vim you can do https://stackoverflow.com/questions/1050640/how-to-stop-vim-from-adding-a-newline-at-end-of-file

```
:set noeol
```

