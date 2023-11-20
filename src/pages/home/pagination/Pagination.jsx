import React, { useEffect, useRef } from "react";
import config from "../../../api/config";
import ReactPaginate from "react-paginate";
import { useParams, useNavigate, useOutlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/slice/productSlice";
import "./Pagination.scss";

const { PAGE_LIMIT } = config;

export default function Pagination() {
  const dispatch = useDispatch();
  const totalPage = useSelector((state) => state.products.totalPage);
  const status = useSelector((state) => state.products.status);
  const { page } = useParams();
  const prevPage = useRef(0);
  const navigate = useNavigate();
  const validCurrentPage = useRef(0);
  const getData = (pageParams) => {
    dispatch(
      getProducts({
        limit: PAGE_LIMIT,
        page: pageParams,
      })
    );
  };

  useEffect(() => {
    const pageParams = +page;

    if (!isNaN(pageParams) && pageParams > 0) {
      if (pageParams <= totalPage || totalPage === 0) {
        if (pageParams !== prevPage.current) {
          getData(pageParams);
          prevPage.current = pageParams;
        }
      } else {
        navigate(`/product/${totalPage}`);
        getData(totalPage);
      }
    } else {
      navigate(`/product/1`);
      getData(1);
    }
  }, [page, totalPage]);
  validCurrentPage.current = Math.min(!isNaN(+page) ? +page : 1, totalPage);
  const handlePageClick = (event) => {
    navigate(`/product/${event.selected + 1}`);
  };
  if (status === 'pending') {
    return;
  }
  return (
    <div className="pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel={<i className="bx bx-chevron-right"></i>}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPage}
        previousLabel={<i className="bx bx-chevron-left"></i>}
        renderOnZeroPageCount={null}
        activeLinkClassName="active"
        forcePage={validCurrentPage.current - 1}
      />
    </div>
  );
}
