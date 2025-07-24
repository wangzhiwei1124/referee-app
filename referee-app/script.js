// **重要**：这里已经为您更新为您的自定义域
const WORKER_URL = 'https://8888.wangzhiwei1124.dpdns.org';

// 获取页面元素
const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');
const searchInput = document.getElementById('searchInput');
const refereeListDiv = document.getElementById('refereeList');
const refereeDetailDiv = document.getElementById('refereeDetail');
const backButton = document.getElementById('backButton');

let allReferees = []; // 缓存所有裁判员基本信息

// 切换视图
function showListView() {
    detailView.classList.add('hidden');
    listView.classList.remove('hidden');
}

function showDetailView() {
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
}

// 渲染裁判员列表
function renderRefereeList(referees) {
    refereeListDiv.innerHTML = '';
    referees.forEach(record => {
        const referee = record.fields;
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
            <div>
                <strong>${referee.姓名}</strong>
                <small style="color: grey; margin-left: 10px;">${referee.单位 || ''}</small>
            </div>
            <span style="color: #007bff;">${referee.裁判等级 || ''}</span>
        `;
        listItem.addEventListener('click', () => fetchRefereeDetail(referee.姓名));
        refereeListDiv.appendChild(listItem);
    });
}

// 获取并渲染单个裁判员的详细信息
async function fetchRefereeDetail(name) {
    showDetailView();
    refereeDetailDiv.innerHTML = '<p class="loading">正在加载详细信息...</p>';
    
    try {
        const response = await fetch(`${WORKER_URL}/detail?name=${encodeURIComponent(name)}`);
        // 检查响应是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        refereeDetailDiv.innerHTML = ''; // 清空加载提示

        // 渲染基本信息
        if (data.basic) {
            const basicInfo = data.basic.fields;
            const basicCard = document.createElement('div');
            basicCard.className = 'detail-card';
            basicCard.innerHTML = `
                <h2>${basicInfo.姓名}</h2>
                <p><span>性别:</span> ${basicInfo.性别 || '未填写'}</p>
                <p><span>出生年月:</span> ${basicInfo.出生年月 || '未填写'}</p>
                <p><span>单位:</span> ${basicInfo.单位 || '未填写'}</p>
                <p><span>裁判等级:</span> ${basicInfo.裁判等级 || '未填写'}</p>
                <p><span>注册单位:</span> ${basicInfo.注册单位 || '未填写'}</p>
                <p><span>批准日期:</span> ${basicInfo.批准日期 || '未填写'}</p>
                <p><span>项目:</span> ${basicInfo.项目 || '未填写'}</p>
            `;
            refereeDetailDiv.appendChild(basicCard);
        }

        // 渲染执裁情况
        const officiatingCard = document.createElement('div');
        officiatingCard.className = 'detail-table';
        officiatingCard.innerHTML = '<h2>执裁情况</h2>';
        if (data.officiating && data.officiating.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `<thead><tr><th>时间</th><th>比赛名称</th><th>岗位</th><th>证明人</th></tr></thead>`;
            let tbody = '<tbody>';
            data.officiating.forEach(record => {
                const item = record.fields;
                tbody += `<tr><td>${item.时间 || ''}</td><td>${item.比赛名称 || ''}</td><td>${item.岗位 || ''}</td><td>${item.证明人 || ''}</td></tr>`;
            });
            tbody += '</tbody>';
            table.innerHTML += tbody;
            officiatingCard.appendChild(table);
        } else {
            officiatingCard.innerHTML += '<p>暂无执裁记录。</p>';
        }
        refereeDetailDiv.appendChild(officiatingCard);

        // 渲染培训情况
        const trainingCard = document.createElement('div');
        trainingCard.className = 'detail-table';
        trainingCard.innerHTML = '<h2>培训情况</h2>';
        if (data.training && data.training.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `<thead><tr><th>时间</th><th>培训班名称</th><th>内容</th><th>地点</th><th>成绩</th></tr></thead>`;
            let tbody = '<tbody>';
            data.training.forEach(record => {
                const item = record.fields;
                tbody += `<tr><td>${item.时间 || ''}</td><td>${item.培训班名称 || ''}</td><td>${item.内容 || ''}</td><td>${item.地点 || ''}</td><td>${item.成绩 || ''}</td></tr>`;
            });
            tbody += '</tbody>';
            table.innerHTML += tbody;
            train
