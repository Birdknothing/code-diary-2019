var LZW = {
    Encode: function (LZWCode, data)
    {
        var ClearCode = 1 << LZWCode;
        var CodeMask = ClearCode - 1;
        var EoiCode = ClearCode + 1;
        var NextCode = EoiCode + 1;
        var CodeSize = LZWCode + 1;
        var Cur = 0;
        var CurShift = 0;
        var Output = [];
        function COut(bc)
        {
            while (CurShift >= bc) {
                Output.push(Cur & 0xff);
                Cur >>= 8;
                CurShift -= 8;
            }
        }

        function DecodeLaw(code) {
            Cur |= code << CurShift;
            CurShift += CodeSize;
            COut(8);
        }

        DecodeLaw(ClearCode);
        var codetable = {};
        var IbCode = data[0] & CodeMask;
        for (var i = 1, il = data.length; i < il; ++i)
        {
            var k = data[i] & CodeMask;
            var curkey = IbCode << 8 | k;
            if(codetable[curkey] === undefined)
            {
                DecodeLaw(IbCode);
                if (NextCode == 4096)
                {
                    DecodeLaw(ClearCode);
                    NextCode = EoiCode + 1;
                    CodeSize = LZWCode + 1;
                    codetable = {};
                }
                else
                {
                    if (NextCode >= 1 << CodeSize) ++CodeSize;
                    codetable[curkey] = NextCode++;
                }
                IbCode = k;
            }
            else
            {
                IbCode = codetable[curkey];
            }
        }
        DecodeLaw(IbCode);
        DecodeLaw(EoiCode);
        COut(1);
        return Output;
    },
    Decode: function (LZWCode, data)
    {
        var result = [];
        var pos = 0;
        var clearCode = 1 << LZWCode;
        var eoiCode = clearCode + 1;
        var codeSize = LZWCode + 1;
        var code = 0;
        var last = 0;
        var dict = [];
        while (true) {
            last = code;
            code = 0;
            for (var i = 0; i < codeSize; i++)
            {
                if ((data[pos >> 3] & (1 << (pos & 7))) != 0)
                {
                    code |= (1 << i);
                }
                pos++;
            }

            if (code == clearCode)
            {
                dict = [];
                codeSize = LZWCode + 1;
                for (var i = 0; i < clearCode; i++)
                {
                    dict[i] = [i];
                }
                dict[clearCode] = [];
                dict[eoiCode] = null;
                continue;
            }
            if (code == eoiCode) break;

            if (code < dict.length)
            {
                if (last != clearCode)
                {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            }
            else
            {
                if (code !== dict.length) throw new Error('Invalid LZW code.');
                dict.push(dict[last].concat(dict[last][0]));
            }
            result.push.apply(result, dict[code]);
            if (dict.length === (1 << codeSize) && codeSize < 12) {
                codeSize++;
            }
        }

        return result;
    }
}

function DVStream(dv) {
    this.dv = dv;
    this.cpos = 0;
    this.ReadString = function(count)
    {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += String.fromCharCode(this.dv.getUint8(this.cpos++));
        }

        return result;
    }

    this.WriteString = function (tow)
    {
        for (var i = 0; i < tow.length; i++) {
            this.dv.setUint8(this.cpos++, tow.charCodeAt(i));
        }
    }

    this.ReadByte = function ()
    {
        return this.dv.getUint8(this.cpos++);
    }

    this.WriteByte = function (tow) {
        this.dv.setUint8(this.cpos++, tow);
    }

    this.ReadUnsignedShort = function ()
    {
        var result = this.dv.getUint16(this.cpos, true);
        this.cpos += 2;
        return result;
    }

    this.WriteUnsignedShort = function (tow) {
        this.dv.setUint16(this.cpos, tow, true);
        this.cpos += 2;
    }

    this.ReadByteArray = function (count)
    {
        var result = [];
        for(var i = 0; i < count; i++)
        {
            result.push(this.dv.getUint8(this.cpos++));
        }
        return result;
    }

    this.WriteByteArray = function (tow) {
        for (var i = 0; i < tow.length; i++) {
            this.dv.setUint8(this.cpos++, tow[i]);
        }
    }

    this.Skin = function (count)
    {
        this.cpos += count;
    }
}

function GIFFile() {
    function PlainTextExtension() {
        this.Data = [];
        this.CodeType = function () { return 0x01; }
        this.FileSize = function()
        {
            return 2 + parseInt(this.Data.length / 254) + (((this.Data.length % 254) == 0) ? 1 : 2) + this.Data.length;
        }
        this.Code = function () {
            return [0x21, 0x01];
        }
        this.Read = function (stream) {
            var blocksize = 0;
            while ((blocksize = stream.ReadByte()) != 0) {
                this.Data = this.Data.concat(stream.ReadByteArray(blocksize));
            }

            return true;
        }
        this.Write = function (stream) {
            stream.WriteByteArray(this.Code());
            var blockcount = parseInt(this.Data.length / 254) + (((this.Data.length % 254) == 0) ? 0 : 1);
            for(var i = 0; i < blockcount - 1; i++)
            {
                stream.WriteByte(0xFE);
                stream.WriteByteArray(this.Data.slice(i * 254, i * 254 + 254));
            }
            stream.WriteByte(this.Data.length % 254);
            stream.WriteByteArray(this.Data.slice((blockcount - 1) * 254, (blockcount - 1) * 254 + this.Data.length % 254));
            stream.WriteByte(0);
        }
    }

    function GraphicsControlExtension() {
        this.Flag = 0;
        this.TimeDelay = 0;
        this.AlphaColor = 0;
        this.IsTransparent = function () { return (this.Flag & 0x1) == 0x1; }
        this.SetTransparent = function (check) { this.Flag = ((this.Flag >> 1) << 1) + (check ? 1 : 0); }
        this.CodeType = function () { return 0xF9; }
        this.FileSize = function () {
            return 8;
        }
        this.Code = function () {
            return [0x21, 0xF9];
        }
        this.Read = function (stream) {
            var blocksize = stream.ReadByte();
            if (blocksize != 4) return false;
            this.Flag = stream.ReadByte();
            this.TimeDelay = stream.ReadUnsignedShort();
            this.AlphaColor = stream.ReadByte();

            return stream.ReadByte() == 0;
        }
        this.Write = function (stream) {
            stream.WriteByteArray(this.Code());
            stream.WriteByte(0x4);
            stream.WriteByte(this.Flag);
            stream.WriteUnsignedShort(this.TimeDelay);
            stream.WriteByte(this.AlphaColor);
            stream.WriteByte(0x0);
        }
    }

    function CommentExtension() {
        this.Data = [];
        this.CodeType = function () { return 0xFE; }
        this.FileSize = function () {
            return 2 + parseInt(this.Data.length / 254) + (((this.Data.length % 254) == 0) ? 1 : 2) + this.Data.length;
        }
        this.Code = function () {
            return [0x21, 0xFE];
        }
        this.Read = function (stream) {
            var blocksize = 0;
            while ((blocksize = stream.ReadByte()) != 0) {
                this.Data = this.Data.concat(stream.ReadByteArray(blocksize));
            }

            return true;
        }
        this.Write = function (stream) {
            stream.WriteByteArray(this.Code());
            var blockcount = parseInt(this.Data.length / 254) + (((this.Data.length % 254) == 0) ? 0 : 1);
            for (var i = 0; i < blockcount - 1; i++) {
                stream.WriteByte(0xFE);
                stream.WriteByteArray(this.Data.slice(i * 254, i * 254 + 254));
            }
            stream.WriteByte(this.Data.length % 254);
            stream.WriteByteArray(this.Data.slice((blockcount - 1) * 254, (blockcount - 1) * 254 + this.Data.length % 254));
            stream.WriteByte(0);
        }
    }

    function ApplicationExtension() {
        this.IdentifierAndCode = [];
        this.SubBlock = [];
        this.CodeType = function () { return 0xFF; }
        this.FileSize = function () {
            return 3 + this.IdentifierAndCode.length + parseInt(this.SubBlock.length / 254) + (((this.SubBlock.length % 254) == 0) ? 1 : 2) + this.SubBlock.length;
        }
        this.Code = function () {
            return [0x21, 0xFF];
        }
        this.Read = function (stream) {
            this.IdentifierAndCode = stream.ReadByteArray(stream.ReadByte());
            var blocksize = 0;
            while ((blocksize = stream.ReadByte()) != 0) {
                this.SubBlock = this.SubBlock.concat(stream.ReadByteArray(blocksize));
            }

            return true;
        }
        this.Write = function (stream) {
            stream.WriteByteArray(this.Code());
            stream.WriteByte(this.IdentifierAndCode.length);
            stream.WriteByteArray(this.IdentifierAndCode);
            var blockcount = parseInt(this.SubBlock.length / 254) + (((this.SubBlock.length % 254) == 0) ? 0 : 1);
            for (var i = 0; i < blockcount - 1; i++) {
                stream.WriteByte(0xFE);
                stream.WriteByteArray(this.SubBlock.slice(i * 254, i * 254 + 254));
            }
            stream.WriteByte(this.SubBlock.length % 254);
            stream.WriteByteArray(this.SubBlock.slice((blockcount - 1) * 254, (blockcount - 1) * 254 + this.SubBlock.length % 254));
            stream.WriteByte(0);
        }
    }

    function ImageDescriptor() {
        this.Left = 0;
        this.Top = 0;
        this.Width = 0;
        this.Height = 0;
        this.PackedField = 0;
        this.LocalTable = { Colors: [] };
        this.LZWCode = 0;
        this.ImageData = [];
        this.CodeType = function () { return 0x2C; }
        this.FileSize = function () {
            var Data = LZW.Encode(this.LZWCode, this.ImageData);
            return 0xB + (this.IsLocalTable() ? this.GetColorCount() * 3 : 0) + parseInt(Data.length / 254) + (((Data.length % 254) == 0) ? 1 : 2) + Data.length;
        }
        this.Code = function () {
            return [0x2C];
        }

        this.IsLocalTable = function () {
            return (this.PackedField & 0x80) == 0x80;
        }

        this.GetColorCount = function () {
            return 2 << (this.PackedField & 0x7);
        }

        this.Read = function (stream) {
            this.Left = stream.ReadUnsignedShort();
            this.Top = stream.ReadUnsignedShort();
            this.Width = stream.ReadUnsignedShort();
            this.Height = stream.ReadUnsignedShort();
            this.PackedField = stream.ReadByte();
            if (this.IsLocalTable()) {
                var count = this.GetColorCount();
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        this.LocalTable.Colors.push({ r: stream.ReadByte(), g: stream.ReadByte(), b: stream.ReadByte() });
                    }
                }
            }

            this.LZWCode = stream.ReadByte();
            var length = 0;
            var LZWData = [];
            while ((length = stream.ReadByte()) != 0) {
                LZWData = LZWData.concat(stream.ReadByteArray(length));
            }
            this.ImageData = LZW.Decode(this.LZWCode, LZWData);

            return true;
        }
        this.Write = function (stream) {
            stream.WriteByteArray(this.Code());
            stream.WriteUnsignedShort(this.Left);
            stream.WriteUnsignedShort(this.Top);
            stream.WriteUnsignedShort(this.Width);
            stream.WriteUnsignedShort(this.Height);
            stream.WriteByte(this.PackedField);
            if (this.IsLocalTable()) {
                var count = this.GetColorCount();
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        var color = this.LocalTable.Colors[i];
                        stream.WriteByte(color.r);
                        stream.WriteByte(color.g);
                        stream.WriteByte(color.b);
                    }
                }
            }
            stream.WriteByte(this.LZWCode);
            var Data = LZW.Encode(this.LZWCode, this.ImageData);
            var blockcount = parseInt(Data.length / 254) + (((Data.length % 254) == 0) ? 0 : 1);
            for (var i = 0; i < blockcount - 1; i++) {
                stream.WriteByte(0xFE);
                stream.WriteByteArray(Data.slice(i * 254, i * 254 + 254));
            }
            stream.WriteByte(Data.length % 254);
            stream.WriteByteArray(Data.slice((blockcount - 1) * 254, (blockcount - 1) * 254 + Data.length % 254));
            stream.WriteByte(0);
        }
    }

    this.GIFHead = { Signature: '', Version: '' }
    this.GIFDataStream = {
        Width: 0, Height: 0, ColorTable: 0, BackColor: 0, PixelAspectRadio: 0,
        GetColorCount: function () { return 2 << (this.ColorTable & 0x7); },
        GetDepth: function () { return ((this.ColorTable * 0x70) >> 4) + 1; }
    }
    this.GlobalTable = { Colors: [] }
    this.Blocks = [];
    this.GetIBlockByCode = function (c) {
        switch (c) {
            case 0x01:
                return new PlainTextExtension();
                break;
            case 0x2C:
                return new ImageDescriptor();
                break;
            case 0xF9:
                return new GraphicsControlExtension();
                break;
            case 0xFE:
                return new CommentExtension();
                break;
            case 0xFF:
                return new ApplicationExtension();
                break;
        }

        return null;
    }

    this.FileSize = function()
    {
        var totalBlockSize = 0;
        for (var i = 0; i < this.Blocks.length; i++)
        {
            totalBlockSize += this.Blocks[i].FileSize();
        }

        return 0xE + this.GIFDataStream.GetColorCount() * 3 + totalBlockSize;
    }

    this.SaveFile = function (blob, filename) {
        var URL = URL || webkitURL || window;
        var type = blob.type;
        var force_saveable_type = 'application/octet-stream';
        if (type && type != force_saveable_type) { // 强制下载，而非在浏览器中打开
            var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
            blob = slice.call(blob, 0, blob.size, force_saveable_type);
        }
        var url = URL.createObjectURL(blob);
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = url;
        save_link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
        URL.revokeObjectURL(url);
    }

    this.ToDataURL = function(callback)
    {
        var fr = new FileReader();
        fr.readAsDataURL(this.ToArrayBuffer());
        fr.onload = function (e)
        {
            if (callback != null)
            {
                callback(e.target.result);
            }
        }

        return fr;
    }

    this.ToArrayBuffer = function()
    {
        var fileBuffer = new ArrayBuffer(this.FileSize());
        var dv = new DVStream(new DataView(fileBuffer));
        dv.WriteString(this.GIFHead.Signature);
        dv.WriteString(this.GIFHead.Version);
        dv.WriteUnsignedShort(this.GIFDataStream.Width);
        dv.WriteUnsignedShort(this.GIFDataStream.Height);
        dv.WriteByte(this.GIFDataStream.ColorTable);
        dv.WriteByte(this.GIFDataStream.BackColor);
        dv.WriteByte(this.GIFDataStream.PixelAspectRadio);
        var count = this.GIFDataStream.GetColorCount();
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var color = this.GlobalTable.Colors[i];
                dv.WriteByte(color.r);
                dv.WriteByte(color.g);
                dv.WriteByte(color.b);
            }
        }
        for (var i = 0; i < this.Blocks.length; i++)
        {
            this.Blocks[i].Write(dv);
        }
        dv.WriteByte(0x3B);
        //var blob = new Blob([fileBuffer]);
        //this.SaveFile(new Blob([fileBuffer]), 'ok.gif');
        return fileBuffer;
    }

    this.LoadFromArrayBuffer = function (buffer) {
        var s = new DVStream(new DataView(buffer));
        this.GIFHead.Signature = s.ReadString(3);
        this.GIFHead.Version = s.ReadString(3);
        this.GIFDataStream.Width = s.ReadUnsignedShort();
        this.GIFDataStream.Height = s.ReadUnsignedShort();
        this.GIFDataStream.ColorTable = s.ReadByte();
        this.GIFDataStream.BackColor = s.ReadByte();
        this.GIFDataStream.PixelAspectRadio = s.ReadByte();
        var count = this.GIFDataStream.GetColorCount();
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                this.GlobalTable.Colors.push({ r: s.ReadByte(), g: s.ReadByte(), b: s.ReadByte() });
            }
        }

        var block = null;
        var code = 0;
        do {
            code = s.ReadByte();
            if (code == 0x21)
                block = this.GetIBlockByCode(s.ReadByte());
            else if (code == 0x2C)
                block = this.GetIBlockByCode(code);
            else if (code == 0x3B)
                break;
            else //Ps Check this File, Error in this File
                break;

            if (block != null) {
                if (!block.Read(s)) {
                    break;
                }
                this.Blocks.push(block);
            }
        } while (block != null);

        return this;
    }
}

var GifDiss =
{ 
    ClipMask: function(file, mask, process)
    {
        var alphaColor = file.GlobalTable.Colors[file.GIFDataStream.BackColor];
        var reColor = file.GIFDataStream.BackColor;
        for (var i = 0; i < file.GlobalTable.Colors.length; i++)
        {
            if(file.GIFDataStream.BackColor == i)
                continue;
            if (file.GlobalTable.Colors[i].r == alphaColor.r && file.GlobalTable.Colors[i].g == alphaColor.g && file.GlobalTable.Colors[i].b == alphaColor.b)
            {
                reColor = i;
                break;
            } 
        }
        
        var alpha = 0;
        var graphice = null;
        var transchange = false;
        for (var i = 0; i < file.Blocks.length; i++) {
            var block = file.Blocks[i];
            if (block.CodeType() == 0xF9) {
                graphice = block;
                alpha = block.AlphaColor;
                if(!block.IsTransparent())
                {
                    block.SetTransparent(true);
                    transchange = true;
                }
                else
                {
                    transchange = false;
                }
            }
            else if(block.CodeType() == 0x2C)
            {
                var backColor = -1;
                if (transchange) {
                    if (block.IsLocalTable()) {
                        var alphaready = false;
                        for (var lc = 0; lc < block.LocalTable.Colors.length; lc++) {
                            var lcorlor = block.LocalTable.Colors[lc];
                            if (lcorlor.r == alphaColor.r && lcorlor.g == alphaColor.g && lcorlor.b == alphaColor.b) {
                                if (!alphaready) {
                                    alpha = lc;
                                    alphaready = true;
                                }
                                else {
                                    backColor = lc
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        alpha = file.GIFDataStream.BackColor;
                        backColor = reColor;
                    }

                    if (graphice != null) graphice.AlphaColor = alpha;
                }

                var lastNoAlpha = 0;
                for (var h = 0; h < block.Height; h++)
                {
                    var mPos = ((block.Top + h) * file.GIFDataStream.Width + block.Left) * 4;
                    for(var w = 0; w < block.Width; w++)
                    {
                        if (process == null)
                        {
                            if (mask.data[mPos + w * 4 + 3] == 0)
                            {
                                block.ImageData[h * block.Width + w] = alpha;
                            }
                        }
                        else
                        {
                            if (process(mask.data[mPos + w * 4], mask.data[mPos + w * 4 + 1], mask.data[mPos + w * 4 + 2], mask.data[mPos + w * 4 + 3]))
                            {
                                block.ImageData[h * block.Width + w] = alpha;
                            }
                            else if (transchange) {
                                if(block.ImageData[h * block.Width + w] == alpha)
                                {
                                    block.ImageData[h * block.Width + w] = backColor;
                                }
                            }

                            if(block.ImageData[h * block.Width + w] != alpha)
                            {
                                lastNoAlpha = h * block.Width + w;
                            }
                        }
                    }
                }

                var leftData = block.Height * block.Width - lastNoAlpha - 1;
                leftData = Math.floor(leftData / block.Width);
                if (leftData != 0)
                {
                    block.ImageData.splice(block.Height * block.Width - leftData * block.Width, leftData * block.Width);
                    block.Height -= leftData;
                }
            }
        }
    },
    ClipCircle: function(file, circle)
    {
        circle.x = Math.floor(circle.x);
        circle.y = Math.floor(circle.y);
        circle.r = Math.floor(circle.r);
        GifDiss.ClipRange(file, { x: circle.x - circle.r, y: circle.y - circle.r, w: circle.r * 2, h: circle.r * 2 });
        GIFGraphics.gifcanvas.height = circle.r * 2;
        GIFGraphics.gifcanvas.width = circle.r * 2;
        GIFGraphics.gifcontext.fillStyle = '#FFFFFF';
        GIFGraphics.gifcontext.fillRect(0, 0, circle.r * 2, circle.r * 2);
        GIFGraphics.gifcontext.beginPath();
        GIFGraphics.gifcontext.arc(circle.r, circle.r, circle.r, 0, Math.PI * 2, true);
        GIFGraphics.gifcontext.closePath();
        GIFGraphics.gifcontext.fillStyle = '#000000';
        GIFGraphics.gifcontext.fill();
        GifDiss.ClipMask(file, GIFGraphics.gifcontext.getImageData(0, 0, circle.r * 2, circle.r * 2), function (r, g, b, a) {
            return (r == 0xFF && g == 0xFF && b == 0xFF);
        });
    },
    ClipRange: function (file, rect)
    {
        rect.x = Math.floor(rect.x);
        rect.y = Math.floor(rect.y);
        rect.w = Math.floor(rect.w);
        rect.h = Math.floor(rect.h);
        for(var i = 0; i < file.Blocks.length; i++)
        {
            var block = file.Blocks[i];
            if (block.CodeType() == 0x2C)
            {
                var clipRect = {};
                clipRect.x = Math.max(rect.x, block.Left);
                clipRect.y = Math.max(rect.y, block.Top);
                clipRect.w = Math.min(rect.x + rect.w, block.Left + block.Width) - clipRect.x;
                clipRect.h = Math.min(rect.y + rect.h, block.Top + block.Height) - clipRect.y;

                if (clipRect.w > 0 && clipRect.h > 0)
                {
                    var idPos = { x: clipRect.x - block.Left, y: clipRect.y - block.Top };
                    block.Left = block.Left > rect.x ? block.Left - rect.x : 0;
                    block.Top = block.Top > rect.y ? block.Top - rect.y : 0;
                    var pixels = [];
                    
                    for (var y = 0; y < clipRect.h; y++)
                    {
                        var linepos = y * clipRect.w;
                        var idlinepos = (idPos.y + y) * block.Width + idPos.x;
                        for (var x = 0; x < clipRect.w; x++)
                        {
                            pixels[linepos + x] = block.ImageData[idlinepos + x];
                        }
                    }
                    block.ImageData = pixels;
                    block.Width = clipRect.w;
                    block.Height = clipRect.h;
                }
            }
        }
        file.GIFDataStream.Width = rect.w;
        file.GIFDataStream.Height = rect.h;
    },
    LoadFromBufferArray: function(buffer)
    {
        return (new GIFFile()).LoadFromArrayBuffer(buffer);
    },
    LoadFromURL: function(url, cb)
    {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "arraybuffer";
        http.onreadystatechange = function () {
            if (http.readyState == http.DONE) {
                cb(GifDiss.LoadFromBufferArray(http.response));
            }
        }
        http.send();
    },
    LoadRawFromURL: function (url, cb)
    {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "arraybuffer";
        http.onreadystatechange = function () {
            if (http.readyState == http.DONE) {
                cb(http.response);
            }
        }
        http.send();
    }
}

var GIFGraphics = (function () {
    this.gifcanvas = document.createElement('canvas');
    if (this.gifcanvas != null) { this.gifcontext = this.gifcanvas.getContext('2d'); }
    return this;
}());