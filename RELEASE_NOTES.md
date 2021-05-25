# AwesomeConfig Release Notes

#### **Version 1.2.0**

 - Address minor bug that may come up when using AwesomeConfig in typescript node modules.
 - Cleaned up some linting errors that could potentially lead to some problems in parsing.

#### **Version 1.1.1**

 - Minor logging output issue fixed.

#### **Version 1.1.0**

 - Documentation updates.

 - Adds several function sfor query configuration a little better:
   - `config().has(key)` will return true if the given key exists.
   - `config().get(key,defaultValue=undefined)` will return the value for the given key, or the provided defaults value or undefined.
   - `config().keys(leafsOnly=false)` will returns all of the keys in the config.

#### **Version 1.0.2**

 - Updating API docs.

 - Updating external dependency versions.

#### **Version 1.0.1**

 - Fixes bug when attempting to JSON.stringify the config object itself.

 - Fixes some bad package name references.

#### **Version 1.0.0**

 - Initial release.
