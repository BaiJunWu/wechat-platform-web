import React, { Fragment, useState } from 'react';
import { Button, Row, InputNumber, Popconfirm, Modal, message } from 'antd';
import { v1 as uuidv1 } from 'uuid';
import CModal from './Modal';
import CTable2 from './Table';
import CTable from 'components/CTable';
import CSelect from 'components/CSelect';
import { deepCopy, pagination } from 'utils/common';

function Price(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [skuList, setList] = useState([]);
  const { dispatch, check, app } = props;
  const { priceList, itemList } = check;
  let itemValue = [];
  if (itemList.length !== 0) {
    itemList.forEach((item) => {
      item.valueList.forEach((item2, index) => {
        itemValue.push({ id: index, name: item.caption + ':' + item2.value });
      });
    });
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onEditItem = (record) => {
    setList(record.skuList);
    setRecord(record);
    setModalVisible(true);
  };
  const handleDelete = (key) => {
    let data = [];
    deepCopy(data, skuList);
    setList(data.filter((item) => item.key !== key));
  };
  const tableProps = {
    size: 'model',
    menuOptions: [{ key: '1', name: '详情', func: onEditItem }],
    columns: [
      {
        dataIndex: 'itemValue',
        title: '规格型号',
        align: 'center',
      },
      {
        dataIndex: 'realPrice',
        title: '结算价格',
        align: 'center',
      },
      {
        dataIndex: 'tagPrice',
        title: '标签价格',
        align: 'center',
      },
      {
        dataIndex: 'costPrice',
        title: '成本价格',
        align: 'center',
      },
      {
        dataIndex: 'point',
        title: '抵扣积分',
        align: 'center',
      },
      {
        dataIndex: 'operation',
        type: 'Operation',
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: 200,
      },
    ],
    dataSource: priceList,
    rowKey: (record) => record.productPriceId,
    pagination: pagination(priceList, (pageIndex, pageSize) => {
      console.log(pageIndex);
      console.log(pageSize);
    }),
  };

  const OptionsList = [
    { id: 0, name: '控制库存' },
    { id: 1, name: '不控制库存' },
  ];

  const selectProps2 = {
    style: { width: '100%' },
    data: OptionsList,
    placeholder: '选择库存类型',
    id: 'id',
    name: 'name',
  };
  const tableProps2 = {
    type: 'price',
    setList,
    appId: app.appId,
    size: 'model',
    menuOptions: [
      { key: '1', name: '修改' },
      { key: '2', name: '删除' },
    ],
    columns: [
      {
        dataIndex: 'productCodeErp',
        title: '产品编码ERP',
        align: 'center',
        editable: true,
        width: 150,
      },
      {
        dataIndex: 'sku',
        title: '库存',
        align: 'center',
        editable: true,
        width: 150,
      },
      {
        dataIndex: 'skuType',
        title: '库存类型',
        align: 'center',
        render: (skuType, record, index) => {
          return (
            <CSelect
              value={skuType}
              onChange={(key) => {
                let data = [];
                deepCopy(data, skuList);
                data[index].skuType = key;
                setList(data);
              }}
              {...selectProps2}
            />
          );
        },
        width: 150,
      },
      {
        dataIndex: 'operation',
        type: 'Operation',
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: 150,
        render: (_, record) =>
          skuList.length >= 1 ? (
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={(record) => handleDelete(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ],
    scroll: { x: 600 },
    dataSource: skuList,
    id: 'productPriceSkuId',
    rowKey: (record) => record.productPriceSkuId,
    pagination: pagination(skuList, (pageIndex, pageSize) => {
      console.log(pageIndex);
      console.log(pageSize);
    }),
  };

  const selectProps = {
    style: { width: '100%' },
    data: itemValue,
    placeholder: '数据来自规格型号表格',
    id: 'name',
    name: 'name',
  };
  const formProps = {
    name: 'type',
    layout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    },
    formItem: [
      {
        label: '规格型号',
        name: 'itemValue',
        placeholder: '规格型号',
        component: <CSelect {...selectProps} />,
        rules: [{ required: true, message: '规格型号不能为空' }],
      },
      {
        label: '结算价格',
        name: 'realPrice',
        placeholder: '结算价格',
        component: (
          <InputNumber placeholder="结算价格" style={{ width: '100%' }} />
        ),
        rules: [{ required: true, message: '结算价格不能为空' }],
      },
      {
        label: '标签价格',
        name: 'tagPrice',
        component: (
          <InputNumber placeholder="标签价格" style={{ width: '100%' }} />
        ),
        rules: [{ required: true, message: '标签价格不能为空' }],
      },
      {
        label: '成本价格',
        name: 'costPrice',
        component: (
          <InputNumber placeholder="成本价格" style={{ width: '100%' }} />
        ),
        rules: [{ required: true, message: '成本价格不能为空' }],
      },
      {
        label: '抵扣积分',
        name: 'point',
        component: (
          <InputNumber placeholder="抵扣积分" style={{ width: '100%' }} />
        ),
      },
    ],
    onFinishFailed,
  };
  // 弹出框对象
  const modalProps = {
    width: '50%',
    title: '创建规格型号',
    centered: true,
    maskClosable: false,
    visible: modalVisible,
    footer: null,
    setModalVisible,
    setRecord,
    record,
    formProps,
    setList,
    component: () => <CTable2 {...tableProps2} />,
  };
  return (
    <Fragment>
      <CTable {...tableProps} />
      <CModal {...modalProps} />
    </Fragment>
  );
}

export default Price;
