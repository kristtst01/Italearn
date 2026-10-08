"""Write lesson JSON in the repo's style: objects and arrays holding only scalars go on one line."""
import json

KEY_ORDER = ['id', 'unit_id', 'name', 'order', 'grammar_tips', 'exercises', 'vocabulary']


def _scalar(v):
    return not isinstance(v, (dict, list))


MAX_LINE = 160


def _fmt(v, indent, prefix_len=0):
    pad = '  ' * indent
    if isinstance(v, dict):
        if all(_scalar(x) for x in v.values()):
            inline = '{ ' + ', '.join(f'{json.dumps(k)}: {json.dumps(x, ensure_ascii=False)}' for k, x in v.items()) + ' }'
            # Short objects stay on one line; long ones (tips) break like the rest
            if len(pad) + prefix_len + len(inline) <= MAX_LINE:
                return inline
        inner = ',\n'.join(f'{pad}  {json.dumps(k)}: {_fmt(x, indent + 1, len(json.dumps(k)) + 2)}' for k, x in v.items())
        return '{\n' + inner + '\n' + pad + '}'
    if isinstance(v, list):
        if all(_scalar(x) for x in v):
            return '[' + ', '.join(json.dumps(x, ensure_ascii=False) for x in v) + ']'
        inner = ',\n'.join(f'{pad}  {_fmt(x, indent + 1)}' for x in v)
        return '[\n' + inner + '\n' + pad + ']'
    return json.dumps(v, ensure_ascii=False)


def dump_lesson(d, path):
    ordered = {k: d[k] for k in KEY_ORDER if k in d}
    ordered.update({k: v for k, v in d.items() if k not in ordered})
    with open(path, 'w') as f:
        f.write(_fmt(ordered, 0) + '\n')
