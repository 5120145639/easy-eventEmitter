class EventEmitter {
    constructor() {
        this.event = {}
    }
    on(key, listener) {
        this.event[key] || (this.event[key] = [])
        this.event[key].push(isObject(listener) ? listener : {listener, once: false})
        return this
    }
    // 只执行一次
    once(key, listener) {
        return this.on(key, {
            listener,
            once: true
        })
    }
    emit(...args) {
        let key = args.shift()
        let fns = this.event[key]
        if (!fns || fns.length === 0) {
            return false
        }
        fns.forEach((fn) => {
            if (isObject(fn)) {
                fn.listener(...args)
                if (fn.once) {
                    this.remove(key, fn)
                }
            }
        })
        return this
    }
    remove(key, listener) {
        let fns = this.event[key]
        if (!fns) {
            return false
        }
        if (!listener) {
            fns && (fns.length = 0)
            return this
        }
        let index = findIndex(fns, listener)
        fns.splice(index, 1)
        return this
    }
}
function isObject(listener) {
    return typeof listener === 'object'
}
function findIndex(arr, val) {
    val = typeof val === 'object' ? val.listener : val
    return arr.findIndex((fn) => {
        return fn === val
    })
}