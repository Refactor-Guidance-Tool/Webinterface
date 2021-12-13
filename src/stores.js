import { browser } from "$app/env";
import { writable, readable } from "svelte/store";

export const pendingRefactor = writable({
    id: "",
    uuid: ""
});

export const socketStore = readable({
  event: "MetaModelUpdated"  
}, set => {
  if (browser) {
    const socket = new WebSocket("ws://localhost:8080");
    socket.addEventListener("message", function (event) {
      set(JSON.parse(event.data));
    });

    return () => { socket.close(); };
  }
});

export const currentProjectUuid = writable("");