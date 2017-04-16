(function(win) {
    var JsTools = {
        /**
         * 使用canvas创建图片报表
         * @param  {[type]} aConfig [配置数据]
         * width: 生成报表宽（整数）
         * height: 生成报表高（整数）
         * aLabelX: 横坐标标签数组（可省略由插件计算）
         * aLabelY: 纵坐标标签数组（可省略由插件计算）
         * aDataX: 横坐标数组
         * aDataY: 纵坐标数组
         * @return {[type]}         base64格式图片地址
         */
        buildReportImage: function(aConfig) {
            var aDefault = {
                font: '10px serif', //字体
                bgColor: '#1e1e1e', //背景颜色
                bgLineColor: '#3b3860', //网格颜色
                fgLineColor: '#dd3702', //底线颜色
                lineColor: '#9d9d9e', //数据线颜色
                pointColor: '#8fff00', //节点颜色
                labelColor: '#9d9d9e', //标题颜色
                maxLabelX: 100, //默认最大标签值
                maxLabelY: 100, //默认最大标签值
                labelDistance: 5, //标题额外距离
                pointWidth: 4,
                margin: [20, 20, 40, 30], //表格外边距
            };
            for (var k in aDefault) {
                if (!aConfig[k]) {
                    aConfig[k] = aDefault[k];
                }
            }
            var i, x, y, line, point;
            var aDataX = aConfig['aDataX'];
            var aDataY = aConfig['aDataY'];
            var maxLabelX = aConfig['maxLabelX'];
            var maxLabelY = aConfig['maxLabelY'];
            var width = aConfig['width'];
            var height = aConfig['height'];
            var mTop = aConfig['margin'][0];
            var mRight = aConfig['margin'][1];
            var mBottom = aConfig['margin'][2];
            var mLeft = aConfig['margin'][3];
            var labelDistance = aConfig['labelDistance'];
            var row = aConfig['row'];
            var column = aConfig['column'];
            var blockW = (width - mLeft - mRight) / (column - 1);
            var blockH = (height - mTop - mBottom) / (row - 1);
            var minX = Math.min.apply(null, aDataX);
            var maxX = Math.max.apply(null, aDataX);
            var minY = Math.min.apply(null, aDataY);
            var maxY = Math.max.apply(null, aDataY);
            var disX = (this.calArray(aDataX) + minX) || maxLabelX;
            var disY = (this.calArray(aDataY) + minY) || maxLabelY;

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            if (!canvas.getContext || typeof(Path2D) == 'undefined') {
                return;
            }

            var ctx = canvas.getContext('2d');
            ctx.font = aConfig['font'];

            //背景色
            ctx.fillStyle = aConfig['bgColor'];
            ctx.fillRect(0, 0, width, height);

            //网格
            ctx.strokeStyle = aConfig['bgLineColor'];
            for (i = 0; i < row; ++i) {
                y = blockH * i + mTop;
                line = new Path2D();
                line.moveTo(mLeft, y);
                line.lineTo(width - mRight, y);

                if (i == row - 1) {
                    continue;
                }
                ctx.stroke(line);
            }
            for (i = 0; i < column; ++i) {
                x = blockW * i + mLeft;
                line = new Path2D();
                line.moveTo(x, mTop);
                line.lineTo(x, height - mBottom);
                if (i == 0) {
                    continue;
                }
                ctx.stroke(line);
            }

            //如果没有标题则生成
            if (!aConfig['aLabelX']) {
                aConfig['aLabelX'] = [];
                var label = '',
                    valueX = Math.ceil(disX / 10) * 10 / (column - 1);
                disX = valueX * (column - 1); //修正偏差
                for (i = 0; i < column; ++i) {
                    label = valueX * i;
                    aConfig['aLabelX'][i] = label % 1 != 0 ? '' : label;
                }
            }
            if (!aConfig['aLabelY']) {
                aConfig['aLabelY'] = [];
                var label = '',
                    valueY = Math.ceil(disY / 10) * 10 / (row - 1);
                disY = valueY * (row - 1); //修正偏差
                for (i = 0; i < row; ++i) {
                    label = valueY * i;
                    aConfig['aLabelY'][i] = label % 1 != 0 ? '' : label;
                }
            }

            //标题
            ctx.strokeStyle = aConfig['labelColor'];
            ctx.textAlign = 'end';
            ctx.textBaseline = 'middle';
            for (i = 0; i < row; ++i) {
                y = blockH * i + mTop;
                ctx.strokeText(aConfig['aLabelY'][row - i - 1], mLeft - labelDistance, y);
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            for (i = 0; i < column; ++i) {
                x = blockW * i + mLeft;
                ctx.strokeText(aConfig['aLabelX'][i], x, height - mBottom + labelDistance);
            }

            //边线
            ctx.strokeStyle = aConfig['fgLineColor'];
            line = new Path2D();
            line.moveTo(mLeft, mTop);
            line.lineTo(mLeft, height - mBottom);
            ctx.stroke(line);
            line = new Path2D();
            line.moveTo(mLeft, height - mBottom);
            line.lineTo(width - mRight, height - mBottom);
            ctx.stroke(line);

            //数据
            ctx.strokeStyle = aConfig['lineColor'];
            line = new Path2D();
            for (i = 0; i < aDataX.length; ++i) {
                x = mLeft + blockW * (column - 1) * aDataX[i] / disX;
                y = height - mBottom - blockH * (row - 1) * aDataY[i] / disY;
                line.lineTo(x, y);
                ctx.stroke(line);

                aDataX[i] = x;
                aDataY[i] = y;
            }
            //节点
            var pointWidth = aConfig['pointWidth'];
            ctx.fillStyle = aConfig['pointColor'];
            for (i = 0; i < aDataX.length; ++i) {
                point = new Path2D();
                x = aDataX[i];
                y = aDataY[i];
                point.arc(x, y, pointWidth, 0, 2 * Math.PI);
                ctx.fill(point);
            }
            return canvas.toDataURL('image/jpeg', 1);
        },

        /**
         * 使用canvas创建饼图
         * @param  {[type]} aValue 数值数组
         * @param  {[type]} aColor 颜色数组
         * @param  {[type]} defaultColor 默认颜色
         * @param  {[type]} width  尺寸
         * @param  {[type]} border  边框
         * @return {[type]}        base64格式图片地址
         */
        buildPieChartImage: function(aValue, aColor, defaultColor, width, border) {
            var canvas = document.createElement('canvas');
            width = width || 200;
            border = border || 20;
            canvas.width = width;
            canvas.height = width;

            if (!canvas.getContext || typeof(Path2D) == 'undefined') {
                return;
            }

            var i, half = width / 2,
                total = 0,
                curAngle = Math.PI * -0.5,
                nextAngle = 0,
                path = null;
            var ctx = canvas.getContext('2d');
            for (i = 0; i < aValue.length; ++i) {
                total += aValue[i];
            }
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, width);
            if (total == 0) {
                ctx.fillStyle = defaultColor;
                path = new Path2D();
                path.moveTo(half, half);
                path.arc(half, half, half, 0, Math.PI * 2);
                ctx.fill(path);
            } else {
                for (i = 0; i < aValue.length; ++i) {
                    nextAngle = curAngle + Math.PI * 2 * aValue[i] / total;
                    ctx.fillStyle = aColor[i];
                    path = new Path2D();
                    path.moveTo(half, half);
                    path.arc(half, half, half, curAngle, nextAngle);
                    ctx.fill(path);
                    curAngle = nextAngle;
                }
            }

            //画内圈
            ctx.fillStyle = '#FFFFFF';
            path = new Path2D();
            path.moveTo(half, half);
            path.arc(half, half, half - border, 0, Math.PI * 2);
            ctx.fill(path);
            return canvas.toDataURL('image/jpeg', 1);
        },

        /**
         * 使用canvas创建雷达图
         * @param  {[type]} aConfig [配置数据]
         * width: 生成图表尺寸
         * aValue: 数据数组(范围0~1)
         * aLabel: 数据对应标签数组
         * fillColor: 中心数据填充颜色
         * strokeColor: 中心数据边框颜色
         * lineColor: 背景层网线颜色
         * aLayerColor: 背景层颜色数组
         * fontSize: 标签字体大小（可选）
         * fontFamily: 标签字体集（可选）
         * fontColor: 标签字体颜色（可选）
         * @return {[type]}         base64格式图片地址
         */
        buildRadarImage: function(aConfig) {
            //计算位置
            function calPos(index, total, radius, origin) {
                var radian = Math.PI * 2 / total * index;
                var x = origin.x + radius * Math.sin(radian);
                var y = origin.y - radius * Math.cos(radian);
                return {
                    x: x,
                    y: y
                };
            }
            //改变文字对齐方式
            function changeDirection(ctx, origin, pos) {
                var align = 'center',
                    baseline = 'middle';
                if (origin.x < pos.x) {
                    align = 'left';
                } else if (origin.x > pos.x) {
                    align = 'right';
                }

                if (origin.y < pos.y) {
                    baseline = 'top';
                } else if (origin.y > pos.y) {
                    baseline = 'bottom';
                }
                ctx.textAlign = align;
                ctx.textBaseline = baseline;
            }
            //画形状
            function drawShape(ctx, posList, fillColor, strokeColor) {
                var path = new Path2D();
                for (var i = 0; i < posList.length; ++i) {
                    var pos = posList[i];
                    if (i == 0) {
                        path.moveTo(pos.x, pos.y);
                    } else {
                        path.lineTo(pos.x, pos.y);
                    }

                    if (i == posList.length - 1) {
                        pos = posList[0];
                        path.lineTo(pos.x, pos.y);
                    }
                }
                if (fillColor) {
                    ctx.fillStyle = fillColor;
                    ctx.fill(path);
                }
                if (strokeColor) {
                    ctx.strokeStyle = strokeColor;
                    ctx.stroke(path);
                }
            }

            var width = aConfig['width'];
            var aValue = aConfig['aValue'];
            var aLabel = aConfig['aLabel'];
            var fillColor = aConfig['fillColor'];
            var strokeColor = aConfig['strokeColor'];
            var lineColor = aConfig['lineColor'];
            var aLayerColor = aConfig['aLayerColor'];
            var fontSize = aConfig['fontSize'] || 12;
            var fontFamily = aConfig['fontFamily'] || "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
            var fontColor = aConfig['fontColor'] || aLayerColor[0];

            var marginTop = 20;
            var marginLeft = 45;
            var halfWith = width / 2;
            var angleCount = aValue.length;
            var origin = {
                x: halfWith + marginLeft,
                y: halfWith + marginTop
            };
            var canvas = document.createElement('canvas');
            canvas.width = width + marginLeft * 2; //设置大小
            canvas.height = width + marginTop;

            if (!canvas.getContext || typeof(Path2D) == 'undefined') {
                return;
            }

            var path, ctx = canvas.getContext('2d');

            //重置画布为白色
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //过渡背景色
            var layerCount = aLayerColor.length,
                posList = [];
            for (var i = 0; i < layerCount; ++i) {
                for (var j = 0; j < angleCount; ++j) {
                    posList[j] = calPos(j, angleCount, halfWith * (layerCount - i) / layerCount, origin);
                }
                drawShape(ctx, posList, aLayerColor[i], i == 0 ? lineColor : null);
            }

            //中心到角线
            ctx.strokeStyle = lineColor;
            for (j = 0; j < angleCount; ++j) {
                var pos = calPos(j, angleCount, halfWith, origin);
                path = new Path2D();
                path.moveTo(origin.x, origin.y);
                path.lineTo(pos.x, pos.y);
                ctx.stroke(path);
            }

            //数值标题
            ctx.font = fontSize + "px " + fontFamily;
            for (j = 0; j < angleCount; ++j) {
                pos = calPos(j, angleCount, halfWith, origin);
                changeDirection(ctx, origin, pos);
                ctx.fillText(aLabel[j], pos.x, pos.y);
            }

            //中间区域颜色
            ctx.lineWidth = 3;
            for (i = 0; i < angleCount; ++i) {
                posList[i] = calPos(i, angleCount, halfWith * aValue[i], origin);
            }
            drawShape(ctx, posList, fillColor, strokeColor);

            return canvas.toDataURL('image/jpeg', 1);
        }
    };

    win.JsTools = $.extend(win.JsTools, JsTools);
})(window);