import request from '@/config/axios'

// 获得备份记录分页
export function getStoreBackupRecordPage(query) {
    return request.get({
        url: '/system/backup/page',
        params: query
    })
}

// 创建备份记录
export function createStoreBackupRecord() {
  return request.post({
    url: '/system/backup/backup',
  })
}


// 还原备份记录
export function rollbackBackupRecord() {
    return request.post({
        url: '/system/backup/revertBackup',
    })
}



