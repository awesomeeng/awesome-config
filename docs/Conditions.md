# [AwesomeConfig](../README.md) > Conditions

Conditions describe certain criteria that must be met in order for the configuration it applies to to be included when merged (during `config().start()`). Conditions can be applied as the second argument of `config().add()` or they can be used inline in the AwesomeConfig Configuration Notation (see [Configuration Notation](./docs/README.md#configuration-notation)).

Here are some examples:

```
os:name=linux

true

hostname:full=localhost and os:cpus>1

hostname:name=test or hostname:name=dev

(hostname:domain=acme.com and env:target=development) or hostname:full=localhost
```

A condition is a string that express one or more conditions that must be met. A conditions support boolean operators like `not` and `and` and `or` as well as grouping with `(condition)`.  It has the form:

```
<condition>|<and_condition>|<or_condition>|<not_condition>|<group_condition>
```

### Condition

A basic condition has the following form:

```
<field><operator><value>|<field><operator>|"true"|"false"
```

Some fields have only operators and no values.

#### Condition Field

A condition field is one of the following possible fields:

 - **${env:xyz}**: References the envionment variables specified, xyz in this case.

 - **${hostname:domain}**: References the last two parts of the hostname, the "google.com" portion.
 - **${hostname:fqdn}**: same as `${hostname:full}`.
 - **${hostname:full}**: References the entire hostname string.
 - **${hostname:name}**: References the first part of the hostname strig, everything up tot he first dot.

 - **${process:args}**: References the arguments passed to the process, as a string.
 - **${process:cwd}**: References the current working directory.
 - **${process:exec}**: References the executable (usually "node" or "node.exe") that ran node.
 - **${process:execPath}**: References the executable (usually "node" or "node.exe") that ran node.
 - **${process:main}**: References the script executed by node at startup.
 - **${process:pid}**: References the process pid.
 - **${process:ppid}**: References te process parent pid.
 - **${process:script}**: References the script executed by node at startup.
 - **${process:version}**: References node.js version, as a string.

 - **${os:arch}**: References the OS arch string, currently one of the following: arm | arm64 | ia32 | mips | mipsel | ppc | ppc64 | s390 | s390x | x32 | x64
 - **${os:type}**: References the OS uname type string; for example "Linux", or "Windows_NT", or "Darwin"
 - **${os:bits}**: References the number of bits in the system (32 or 64)
 - **${os:cpus}**: References the number of CPUs reported to node.js
 - **${os:home}**: References the home directory path.
 - **${os:homedir}**: References the home directory path.
 - **${os:platform}**: References the OS platform string, currently one of the following:  aix | darwin | freebsd | linux | openbsd | sunos | win32
 - **${os:user}**: References the OS family name.
 - **${os:username}**: References the OS family name.

 - **${string:encoding}**: References the default encoding type for strings, usually "utf-8".
 - **${string:eol}**: References the system EOL character like "\n".

#### Condition Operator

A condition operator is what type of comparison you are doing on the field. Some Operators require a value for the comparison, some do not.

The set of operators depends on which field you are using.

 - **${env:xyz}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^

 - **${hostname:domain}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${hostname:fqdn}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${hostname:full}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${hostname:name}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^

 - **${process:args}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${process:cwd}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${process:exec}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${process:execPath}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${process:main}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${process:pid}**: = | == | === | != | !== | > | >= | < | <
 - **${process:ppid}**: = | == | === | != | !== | > | >= | < | <
 - **${process:script}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${process:version}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^

 - **${os:arch}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${os:type}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${os:bits}**: = | == | === | != | !== | > | >= | < | <
 - **${os:cpus}**: = | == | === | != | !== | > | >= | < | <
 - **${os:home}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${os:homedir}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${os:platform}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${os:user}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${os:username}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^

 - **${string:encoding}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^
 - **${string:eol}**: = | == | === | != | !== | ~ | !~ | $ | !$ | ^ | !^

The operators have the following meanings...

 - **=**: Equality. Applies to String | Number | Booelan types.
 - **==**: Equality. Applies to String | Number | Booelan types.
 - **===**: Equality. Applies to String | Number | Booelan types.
 - **!=**: Inequality. Applies to String | Number | Booelan types.
 - **!==**: Inequality. Applies to String | Number | Booelan types.
 - **~**: Contains. Applies to String types.
 - **!~**: Does not contain. Applies to String types.
 - **$**: Starts with. Applies to String types.
 - **~$=**: Does not start with. Applies to String types.
 - **^**: Ends with. Applies to String types.
 - **!^=**: Does not end with. Applies to String types.
 - **>**: Greater than. Applies to Number types.
 - **>=**: Greater than or equal. Applies to Number types.
 - **<**: Less than. Applies to Number types.
 - **<=**: Less than or equal. Applies to Number types.

#### Condition Value

A condition value is whatever you are comparing against the field.  Not all field/operator combinations require values.

The type you are comparing should be the same as the type produced by the field. So number fields like `os:cpus` should have number values.

Boolean types can specify either `true` or `false`.

Number types can specify any valid number including decimals, but not NaN.

String types can specify any string and may be single quoted, double quoted, or omit the quotes entirely if the string does not contain spaces.

### And Condition

You may specify boolean "and" conditions with the form

```
<condition> and <condition>
```

In order for the And Condition to be true, both the left and right conditions must also be true. You may string multiple And Conditions together as shown here:

The `and` is case insensitive.

```
<condition> and <condition> and <condition> and <condition> (etc)
```

### Or Condition

You may specify boolean "or" conditions with the form

```
<condition> or <condition>
```

In order for the Or Condition to be true, either the left or right conditions must be true. You may string multiple Or Conditions together as shown here:

```
<condition> or <condition> or <condition> or <condition> (etc)
```

The `or` is case insensitive.

### Not Condition

You may specify boolean "and" conditions with the form

```
not <condition>
```

In order for the Not Condition to be true, the given condition must be false. You may not string multiple Not Conditions together.

### Grouping

You may group several conditions together with the form

```
(<condition>|<and_condition>|<or_condition>|<not_condition>|<group_condition>)
```

The grouped condition returns true, if the inner condition returns true.

## Condition Usage

You can use conditions in two ways:

First, when calling `config().add(...)` you may supply a condition as the second argument and that becomes the condition for the entire added configuration.

```
config().add({
	... some config ...
},"os:cpus>=2");
```

Second, If you are using AwesomeConfig Configuration Notation (see [Configuration Notation](./docs/README.md#configuration-notation)) you may include a conditions to mark section of the notation.

```
... some config...

[os:cpus>=2]
... more config ...
```
