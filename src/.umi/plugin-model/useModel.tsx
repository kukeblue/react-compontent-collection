import { useState, useEffect, useContext, useRef } from 'react';
// @ts-ignore
import isEqual from '/Users/huanchen/Project/cs/chui/node_modules/lodash.isequal/index.js';
// @ts-ignore
import { UmiContext } from '/Users/huanchen/Project/cs/chui/node_modules/@umijs/plugin-model/lib/helpers/constant';
import { Model, models } from './Provider';

export type Models<T extends keyof typeof models> = Model<T>[T]

export function useModel<T extends keyof Model<T>>(model: T): Model<T>[T]
export function useModel<T extends keyof Model<T>, U>(model: T, selector: (model: Model<T>[T]) => U): U

export function useModel<T extends keyof Model<T>, U>(
  namespace: T,
  updater?: (model: Model<T>[T]) => U
) : typeof updater extends undefined ? Model<T>[T] : ReturnType<NonNullable<typeof updater>>{

  type RetState = typeof updater extends undefined ? Model<T>[T] : ReturnType<NonNullable<typeof updater>>
  const dispatcher = useContext<any>(UmiContext);
  const updaterRef = useRef(updater);
  updaterRef.current = updater;
  const [state, setState] = useState<RetState>(
    () => updaterRef.current ? updaterRef.current(dispatcher.data![namespace]) : dispatcher.data![namespace]
  );
  const lastState = useRef<any>(state);

  useEffect(() => {
    const handler = (e: any) => {
      if(updater && updaterRef.current){
        const ret = updaterRef.current(e);
        if(!isEqual(ret, lastState.current)){
          lastState.current = ret;
          setState(ret);
        }
      } else {
        setState(e);
      }
    }
    try {
      dispatcher.callbacks![namespace]!.add(handler);
    } catch (e) {
      dispatcher.callbacks![namespace] = new Set();
      dispatcher.callbacks![namespace]!.add(handler);
    }
    return () => {
      dispatcher.callbacks![namespace]!.delete(handler);
    }
  }, [namespace]);

  return state;
};
