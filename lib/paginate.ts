/* eslint-disable @typescript-eslint/no-explicit-any */

type PaginateOptions = {
  page?: number;
  perPage?: number;
  where?: any;
  orderBy?: any;
  include?: any;
};

/**
 * Paginate function
 * @description
 * This function is used to paginate the data from the database. It takes a model and options as parameters.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
 * @param model
 * @param options
 * @example
 * ```tsx
 * const params = await searchParams
 * const page = Number(params.page || 1);
 * const motorcycles = await paginate(prisma.motorcycle, {
 *      page,
 *      perPage: 9,
 *      orderBy: { createdAt: 'desc' },
 *  });
 *
 *  return (
 *      {motorcycles.data.map((motorcycle) => (
 *          <Component key={motorcycle.id} motorcycle={motorcycle} />
 *      ))}
 *
 *   <Paginate currentPage={motorcycles.current_page} totalPages={motorcycles.last_page}/>
 * );
 * ```
 */

export async function paginate(model: { findMany: any; count: any }, options: PaginateOptions) {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? 10;
  const skip = (page - 1) * perPage;

  const [data, total] = await Promise.all([
    model.findMany({
      skip,
      take: perPage,
      where: options.where,
      orderBy: options.orderBy,
      include: options.include,
    }),
    model.count({ where: options.where }),
  ]);

  return {
    data,
    total,
    per_page: perPage,
    current_page: page,
    last_page: Math.ceil(total / perPage),
  };
}
