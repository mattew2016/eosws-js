import { EoswsListeners, ListenerObject } from "../listeners"
import { InboundMessageType } from "../../message/inbound"

describe("listeners", function() {
  const noopCallback = () => {
    return
  }

  describe("addListener", () => {
    it("should add a listener to the list", () => {
      const listenerObject: ListenerObject = {
        reqId: "abc",
        callback: noopCallback
      }

      const listeners = new EoswsListeners()

      listeners.addListener(listenerObject)

      expect(listeners.registeredListeners).toEqual([listenerObject])
    })
  })

  describe("removeListener", () => {
    it("should add a listener to the list", () => {
      const listenerObject1: ListenerObject = {
        reqId: "abc",
        callback: noopCallback
      }

      const listenerObject2: ListenerObject = {
        reqId: "abcd",
        callback: noopCallback
      }

      const listeners = new EoswsListeners()

      listeners.addListener(listenerObject1)
      listeners.addListener(listenerObject2)
      expect(listeners.registeredListeners).toEqual([listenerObject1, listenerObject2])

      listeners.removeListener("abc")

      expect(listeners.registeredListeners).toEqual([listenerObject2])
    })
  })

  describe("handleMessage", () => {
    it("should process the callback given the right id and type", () => {
      const customCallback = jest.fn()
      const listenerObject1: ListenerObject = {
        reqId: "abc",
        callback: customCallback
      }

      const listenerObject2: ListenerObject = {
        reqId: "abcd",
        callback: noopCallback
      }

      const listeners = new EoswsListeners()
      listeners.addListener(listenerObject1)
      listeners.addListener(listenerObject2)

      listeners.handleMessage({
        type: InboundMessageType.TABLE_DELTA,
        req_id: "abc",
        data: { test: "foo" }
      })

      expect(customCallback).toHaveBeenCalledWith({
        type: InboundMessageType.TABLE_DELTA,
        req_id: "abc",
        data: { test: "foo" }
      })
    })
  })
})
