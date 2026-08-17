import { Fragment } from "react";
import { interests, learning, skillGroups } from "../content/skills";

const ITEMS_PER_LINE = 3;

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function StringList({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item}>
          <span className="code-string">&quot;{item}&quot;</span>
          <span className="code-punct">{index < items.length - 1 ? ", " : ","}</span>
        </Fragment>
      ))}
    </>
  );
}

function TableBlock({ name, comment, items }) {
  return (
    <>
      <p className="code-line">
        <span className="code-comment">-- {comment}</span>
      </p>
      <p className="code-line">
        <span className="code-var">toby</span>
        <span className="code-punct">.</span>
        <span className="code-field">{name}</span>
        <span className="code-punct"> = {"{"}</span>
      </p>
      {chunk(items, ITEMS_PER_LINE).map((row, index) => (
        <p className="code-line" key={index}>
          {"  "}
          <StringList items={row} />
        </p>
      ))}
      <p className="code-line">
        <span className="code-punct">{"}"}</span>
      </p>
      <p className="blank"></p>
    </>
  );
}

export default function Skills() {
  return (
    <div className="page page-code">
      <h1>skills.lua</h1>

      <p className="code-line">
        <span className="code-comment">-- what I actually reach for, not everything I have opened once</span>
      </p>
      <p className="code-line">
        <span className="code-keyword">local</span> <span className="code-var">toby</span>
        <span className="code-punct"> = {"{}"}</span>
      </p>
      <p className="blank"></p>

      {skillGroups.map((group) => (
        <TableBlock key={group.key} name={group.label} comment={group.comment} items={group.items} />
      ))}

      <p className="code-line">
        <span className="code-comment">-- currently working through</span>
      </p>
      <p className="code-line">
        <span className="code-var">toby</span>
        <span className="code-punct">.</span>
        <span className="code-field">learning</span>
        <span className="code-punct"> = {"{"}</span>
      </p>
      {learning.map((item) => (
        <p className="code-line" key={item}>
          {"  "}
          <span className="code-string">&quot;{item}&quot;</span>
          <span className="code-punct">,</span>
        </p>
      ))}
      <p className="code-line">
        <span className="code-punct">{"}"}</span>
      </p>
      <p className="blank"></p>

      <p className="code-line">
        <span className="code-comment">-- and away from a keyboard</span>
      </p>
      <p className="code-line">
        <span className="code-var">toby</span>
        <span className="code-punct">.</span>
        <span className="code-field">interests</span>
        <span className="code-punct"> = {"{"}</span>
      </p>
      {interests.map((item) => (
        <p className="code-line" key={item}>
          {"  "}
          <span className="code-string">&quot;{item}&quot;</span>
          <span className="code-punct">,</span>
        </p>
      ))}
      <p className="code-line">
        <span className="code-punct">{"}"}</span>
      </p>
      <p className="blank"></p>

      <p className="code-line">
        <span className="code-keyword">function</span> <span className="code-var">toby</span>
        <span className="code-punct">.</span>
        <span className="code-func">available</span>
        <span className="code-punct">()</span>
      </p>
      <p className="code-line">
        {"  "}
        <span className="code-keyword">return</span> <span className="code-boolean">true</span>
        <span className="code-comment"> -- graduate roles, summer 2027</span>
      </p>
      <p className="code-line">
        <span className="code-keyword">end</span>
      </p>
      <p className="blank"></p>

      <p className="code-line">
        <span className="code-keyword">return</span> <span className="code-var">toby</span>
      </p>
    </div>
  );
}
