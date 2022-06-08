/* Copyright 2021, Milkdown by Mirone. */
import type { Attrs, CmdKey, Emotion, MilkdownPlugin, Slice, ThemeManager } from '@milkdown/core';
import { CmdTuple, Ctx, RemarkPlugin } from '@milkdown/core';
import { ViewFactory } from '@milkdown/prose';
import { InputRule } from '@milkdown/prose/inputrules';
import { Plugin } from '@milkdown/prose/state';

export type Utils = {
    readonly getClassName: (attrs: Attrs, ...defaultValue: (string | null | undefined)[]) => string;
    readonly getStyle: (style: (emotion: Emotion) => string | void) => string | undefined;
    readonly themeManager: ThemeManager;
};

export type UnknownRecord = Record<string, unknown>;

export type CommandConfig<T = unknown> = [commandKey: CmdKey<T>, defaultKey: string, args?: T];

export type CommonOptions<SupportedKeys extends string = string, Obj = UnknownRecord> = Obj & {
    className?: (attrs: Attrs, ...defaultValue: (string | null | undefined)[]) => string;
    keymap?: Partial<Record<SupportedKeys, string | string[]>>;
    headless?: boolean;
    view?: (ctx: Ctx) => ViewFactory;
};

export type Methods<Keys extends string, Type> = {
    remarkPlugins?: (ctx: Ctx) => RemarkPlugin[];
    inputRules?: (types: Type, ctx: Ctx) => InputRule[];
    prosePlugins?: (types: Type, ctx: Ctx) => Plugin[];
    commands?: (types: Type, ctx: Ctx) => CmdTuple[];
    shortcuts?: Record<Keys, CommandConfig>;
};

export type GetPlugin<SupportedKeys extends string = string, Options extends UnknownRecord = UnknownRecord> = (
    options?: Partial<CommonOptions<SupportedKeys, Options>>,
) => MilkdownPlugin;

export type Metadata<Origin = unknown> = {
    origin: Origin;
};
export type AddMetadata<SupportedKeys extends string = string, Options extends UnknownRecord = UnknownRecord> = (
    options?: Partial<CommonOptions<SupportedKeys, Options>>,
) => Metadata<GetPlugin<SupportedKeys, Options>> & MilkdownPlugin;

export type Spec<SupportedKeys extends string, Type, Rest> = Methods<SupportedKeys, Type> & Rest;
export type Factory<SupportedKeys extends string, Options extends UnknownRecord, Type, Rest> = (
    utils: Utils,
    options?: Partial<CommonOptions<SupportedKeys, Options>>,
) => Spec<SupportedKeys, Type, Rest>;
export type WithExtend<SupportedKeys extends string, Options extends UnknownRecord, Type, Rest> = AddMetadata<
    SupportedKeys,
    Options
> & {
    extend: <
        ExtendedSupportedKeys extends string = SupportedKeys,
        ExtendedOptions extends UnknownRecord = Options,
        ExtendedType extends Type = Type,
        ExtendedRest extends Rest = Rest,
    >(
        extendFactory: (
            ...args: [
                original: Spec<SupportedKeys, Type, Rest>,
                ...rest: Parameters<Factory<ExtendedSupportedKeys, ExtendedOptions, ExtendedType, ExtendedRest>>,
            ]
        ) => Spec<ExtendedSupportedKeys, ExtendedType, ExtendedRest>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inject?: Slice<any>[],
    ) => WithExtend<ExtendedSupportedKeys, ExtendedOptions, Type, Rest>;
};
