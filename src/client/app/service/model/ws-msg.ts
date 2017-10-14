
export const enum WsFromClientEvents {
  ANNOTATION_GET = 'annotation-get',
  ANNOTATION_ADD = 'annotation-add',
  ANNOTATION_EDIT = 'annotation-edit',
  ANNOTATION_DELETE = 'annotation-delete'
};

export const enum WsFromServerEvents {
  UNAUTHORIZED = 'unauthorized',
  DISCONNECT = 'disconnect',
  ANNOTATION_GET = 'annotation-get',
  ANNOTATION_ADD_FAIL = 'annotation-add-fail',
  ANNOTATION_EDIT_FAIL = 'annotation-edit-fail',
  ANNOTATION_DELETE_FAIL = 'annotation-delete-fail'
};

export interface WsMsg {
  event: WsFromServerEvents;
  data?: any;
}
